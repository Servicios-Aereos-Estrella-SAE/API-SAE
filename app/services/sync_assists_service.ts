/* eslint-disable prettier/prettier */
import AssistStatusSync from '#models/assist_status_sync'
import { DateTime } from 'luxon'
import axios from 'axios'
import PageSync from '#models/assist_page_sync'
import ResponseApiAssistsDto from '#dtos/response_api_assists_dto'
import PaginationDto from '#dtos/pagination_api_dto'
import Assist from '#models/assist'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import Employee from '#models/employee'
import { AssistDayInterface } from '../interfaces/assist_day_interface.js'
import { AssistInterface } from '../interfaces/assist_interface.js'
import AssistStatusResponseDto from '#dtos/assist_status_response_dto'
import ShiftForEmployeeService from './shift_for_employees_service.js'
import { EmployeeRecordInterface } from '../interfaces/employee_record_interface.js'
import type { ShiftRecordInterface } from '../interfaces/shift_record_interface.js'
import HolidayService from './holiday_service.js'
import { HolidayInterface } from '../interfaces/holiday_interface.js'
import { ShiftExceptionInterface } from '../interfaces/shift_exception_interface.js'
import ToleranceService from './tolerance_service.js'
import { AssistSyncFilterInterface } from '../interfaces/assist_sync_filter_interface.js'
import AssistsService from './assist_service.js'
export default class SyncAssistsService {
  /**
   * Retrieves the status sync of assists.
   * @returns {Promise<AssistStatusResponseDto>} The assist status response DTO.
   */
  async getStatusSync(): Promise<AssistStatusResponseDto | null> {
    const assistStatusSync = await this.getAssistStatusSync()
    let lastPageSync = await this.getLastPageSync()
    if (assistStatusSync && lastPageSync) {
      let dataApiBiometrics = {
        pagination: {
          totalItems: 0,
          page: 0,
          pageSize: 0,
          totalPages: 0,
          DateParam: new Date(),
        },
      }

      try {
        dataApiBiometrics = await this.fetchExternalData(
          assistStatusSync.dateRequestSync.toJSDate(),
          lastPageSync.pageNumber
        )
      } catch (error) {}

      return new AssistStatusResponseDto(
        assistStatusSync,
        lastPageSync,
        dataApiBiometrics.pagination
      )
    }
    return null
  }

  async synchronize(startDate: string, page: number = 1, limit: number = 50) {
    const dateParam = new Date(startDate)
    let statusSync = await this.getAssistStatusSync()

    if (!statusSync) {
      page = 1
      let response = await this.fetchExternalData(dateParam, page, limit)
      statusSync = await this.createAssistStatusSync(response.pagination)
      await this.createPageSyncRecords(statusSync.id, response.pagination)
      await this.updateLocalData(response)
    } else if (new Date(statusSync.dateRequestSync.toJSDate()) > dateParam) {
      page = 1
      let response = await this.fetchExternalData(dateParam, page, limit)
      await this.resetSyncStatus(response.pagination, statusSync.id)
      await this.updateLocalData(response)
    } else {
      const pagesToSync = await this.getPagesByPageRequest(page)
      for await (const pageSync of pagesToSync) {
        await this.handleSyncAssists(
          statusSync,
          statusSync.dateRequestSync.toJSDate(),
          pageSync.pageNumber,
          limit
        )
      }
    }
    let result = await this.getAssistsRecords(dateParam, page, limit)
    let result2 = result.toJSON()
    result2.meta = {
      ...result2.meta,
      totalApiItems: statusSync.itemsTotalSync,
      totalApiPages: statusSync.pageTotalSync,
      apiPage: page,
      apiPageSize: limit,
    }
    return result2
  }

  async synchronizeByEmployee(filters: AssistSyncFilterInterface) {
    const dateParam = new Date(filters.startDate)
    const dateEndParam = new Date(filters.endDate)
    let response = await this.fetchExternalDataEmployee(
      dateParam,
      dateEndParam,
      filters.empCode,
      filters.page,
      filters.limit
    )
    const assists = await this.saveAssistDataEmployee(response)
    const assistService = new AssistsService()
    for await (const assist of assists) {
      const logAssist = await assistService.createActionLog(filters.rawHeaders, 'store')
      logAssist.user_id = filters.userId
      logAssist.create_from = 'sync'
      logAssist.record_current = JSON.parse(JSON.stringify(assist))
      await assistService.saveActionOnLog(logAssist)
    }
    return response
  }

  async handleSyncAssists(
    statusSync: AssistStatusSync,
    dateParam: Date,
    page: number = 1,
    limit: number = 50
  ) {
    let response = await this.fetchExternalData(dateParam, page, limit)
    await this.updateLocalData(response)
    await this.updatePageSync(page, 'sync', this.getItemsCountsPage(page, response.pagination))
    await this.updatePagination(response.pagination, statusSync)
  }

  async isPageSynced(pageSyncId: number) {
    const pageSync = await PageSync.query().where('id', pageSyncId).first()
    return pageSync?.pageStatus === 'sync'
  }
  getLogger = () => logger

  async getAssistsRecords(dateParam: Date, page: number, limit: number) {
    return Assist.query()
      .where('assistPunchTime', '>', dateParam)
      .orderBy('assistPunchTime', 'asc')
      .paginate(page, limit)
  }

  async getAssistStatusSync() {
    return await AssistStatusSync.query().orderBy('date_request_sync', 'desc').first()
  }

  async createAssistStatusSync(pagination: PaginationDto) {
    return await AssistStatusSync.create({
      dateRequestSync: DateTime.fromISO(pagination.DateParam.toString()),
      dateTimeStartSync: DateTime.fromISO(pagination.DateParam.toString()),
      statusSync: 'in_process',
      pageTotalSync: pagination.totalPages,
      itemsTotalSync: pagination.totalItems,
    })
  }

  async getPageSync(statusSyncId: number, pageNumber: number = 1) {
    const pageSync = await PageSync.query()
      .where('status_sync_id', statusSyncId)
      .andWhere('page_number', pageNumber)
      .first()

    return pageSync
  }

  async resetSyncStatus(pagination: PaginationDto, statusSyncId: number) {
    const statusSync = await AssistStatusSync.query().where('id', statusSyncId).first()
    if (statusSync) {
      await statusSync
        .merge({
          dateRequestSync: DateTime.fromISO(pagination.DateParam.toString()),
          dateTimeStartSync: DateTime.fromISO(pagination.DateParam.toString()),
          statusSync: 'in_process',
          pageTotalSync: pagination.totalPages,
          itemsTotalSync: pagination.totalItems,
        })
        .save()
    }

    // delete all page sync records
    await PageSync.query().where('status_sync_id', statusSyncId).delete()
    // recreate page sync records
    await this.createPageSyncRecords(statusSyncId, pagination)
  }

  async fetchExternalData(
    startDate: Date,
    page: number,
    limit: number = 50
  ): Promise<ResponseApiAssistsDto> {
    logger.info(`Fetching data from external API for date ${startDate.toISOString()}`)
    // Aquí harías la petición a la API externa
    let apiUrl = `${env.get('API_BIOMETRICS_HOST')}/transactions-async`
    apiUrl = `${apiUrl}?page=${page || ''}`
    apiUrl = `${apiUrl}&limit=${limit || ''}`
    apiUrl = `${apiUrl}&assistDate=${startDate.toISOString() || ''}`
    logger.info(`API URL: ${apiUrl}`)
    const apiResponse = await axios.get(apiUrl)
    let responseDataDto: ResponseApiAssistsDto
    responseDataDto = apiResponse.data
    responseDataDto.pagination = apiResponse.data.pagination
    return responseDataDto
  }

  async fetchExternalDataEmployee(
    startDate: Date,
    endDate: Date,
    empCode: string,
    page: number,
    limit: number = 50
  ): Promise<ResponseApiAssistsDto> {
    logger.info(`Fetching data from external API for date ${startDate.toISOString()}`)
    // Aquí harías la petición a la API externa
    let apiUrl = `${env.get('API_BIOMETRICS_HOST')}/transactions-by-employee-async`
    apiUrl = `${apiUrl}?page=${page || ''}`
    apiUrl = `${apiUrl}&limit=${limit || ''}`
    apiUrl = `${apiUrl}&assistStartDate=${startDate.toISOString() || ''}`
    apiUrl = `${apiUrl}&assistEndDate=${endDate.toISOString() || ''}`
    apiUrl = `${apiUrl}&empCode=${empCode || ''}`
    logger.info(`API URL: ${apiUrl}`)
    const apiResponse = await axios.get(apiUrl)
    let responseDataDto: ResponseApiAssistsDto
    responseDataDto = apiResponse.data
    responseDataDto.pagination = apiResponse.data.pagination
    return responseDataDto
  }

  async updateLocalData(externalData: ResponseApiAssistsDto) {
    for await (const item of externalData.data) {
      const existingAssist = await Assist.findBy('assist_sync_id', item.id)
      // convert objetct to string
      if (existingAssist) {
        await existingAssist
          .merge({
            assistEmpCode: item.emp_code,
            assistTerminalSn: item.terminal_sn,
            assistTerminalAlias: item.terminal_alias,
            assistAreaAlias: item.area_alias,
            assistLongitude: item.longitude,
            assistLatitude: item.latitude,
            assistUploadTime: DateTime.fromISO(item.upload_time.toString()),
            assistEmpId: item.emp_id,
            assistTerminalId: item.terminal_id,
            assistPunchTime: DateTime.fromISO(item.punch_time_local.toString()),
            assistPunchTimeUtc: DateTime.fromISO(item.punch_time.toString()),
            assistPunchTimeOrigin: DateTime.fromISO(item.punch_time_origin_real.toString()),
          })
          .save()
      } else {
        const newAssist = new Assist()
        newAssist.assistEmpCode = item.emp_code
        newAssist.assistTerminalSn = item.terminal_sn
        newAssist.assistTerminalAlias = item.terminal_alias
        newAssist.assistAreaAlias = item.area_alias
        newAssist.assistLongitude = item.longitude
        newAssist.assistLatitude = item.latitude
        newAssist.assistUploadTime = DateTime.fromISO(item.upload_time.toString())
        newAssist.assistEmpId = item.emp_id
        newAssist.assistTerminalId = item.terminal_id
        newAssist.assistPunchTime = DateTime.fromISO(item.punch_time_local.toString())
        newAssist.assistPunchTimeUtc = DateTime.fromISO(item.punch_time.toString())
        newAssist.assistPunchTimeOrigin = DateTime.fromISO(item.punch_time_origin_real.toString())
        newAssist.assistSyncId = item.id
        await newAssist.save()
      }
    }
  }

  async saveAssistDataEmployee(externalData: ResponseApiAssistsDto) {
    const assists = [] as Array<Assist>
    for await (const item of externalData.data) {
      const existingAssist = await Assist.findBy('assist_sync_id', item.id)
      // convert objetct to string
      if (!existingAssist) {
        const newAssist = new Assist()
        newAssist.assistEmpCode = item.emp_code
        newAssist.assistTerminalSn = item.terminal_sn
        newAssist.assistTerminalAlias = item.terminal_alias
        newAssist.assistAreaAlias = item.area_alias
        newAssist.assistLongitude = item.longitude
        newAssist.assistLatitude = item.latitude
        newAssist.assistUploadTime = DateTime.fromISO(item.upload_time.toString())
        newAssist.assistEmpId = item.emp_id
        newAssist.assistTerminalId = item.terminal_id
        newAssist.assistPunchTime = DateTime.fromISO(item.punch_time_local.toString())
        newAssist.assistPunchTimeUtc = DateTime.fromISO(item.punch_time.toString())
        newAssist.assistPunchTimeOrigin = DateTime.fromISO(item.punch_time_origin_real.toString())
        newAssist.assistSyncId = item.id
        await newAssist.save()
        assists.push(newAssist)
      }
    }
    return assists
  }

  async updatePageSync(page: number, status: string, itemsCount: number) {
    await PageSync.query().where('page_number', page).update({
      page_status: status,
      items_count: itemsCount,
    })
  }

  async createPageSyncRecords(statusSyncId: number, pagination: PaginationDto) {
    for (let pageNumber: number = 1; pageNumber <= pagination.totalPages; pageNumber++) {
      const existingPageSync = await PageSync.query()
        .where('status_sync_id', statusSyncId)
        .andWhere('page_number', pageNumber)
        .first()

      if (!existingPageSync) {
        const itemsCount = this.getItemsCountsPage(pageNumber, pagination)
        const pageNumberAsString = String(pageNumber)
        const statusPage = String(pagination.page) === pageNumberAsString ? 'sync' : 'pending'
        await PageSync.create({
          statusSyncId: statusSyncId,
          pageNumber: pageNumber,
          pageStatus: statusPage,
          itemsCount: itemsCount,
        })
      }
    }
  }

  async updatePagination(pagination: PaginationDto, statusSync: AssistStatusSync) {
    // update status sync
    logger.info(
      `Updating status sync with id ${statusSync.id}, page total sync ${pagination.totalPages} and items total sync ${pagination.totalItems}`
    )
    await AssistStatusSync.query().where('id', statusSync.id).update({
      pageTotalSync: pagination.totalPages,
      itemsTotalSync: pagination.totalItems,
    })

    for (let pageNumber: number = 1; pageNumber <= pagination.totalPages; pageNumber++) {
      let pageSync = await PageSync.query().where('page_number', pageNumber).first()
      const countItems = this.getItemsCountsPage(pageNumber, pagination)
      // logger information pages
      if (!pageSync) {
        await PageSync.create({
          statusSyncId: statusSync.id,
          pageNumber: pageNumber,
          pageStatus: 'pending',
          itemsCount: countItems,
        })
      } else {
        const countItemsString = String(countItems)
        const pageItemsString = String(pageSync.itemsCount)
        const statusText =
          countItemsString === pageItemsString && pageSync.pageStatus === 'sync'
            ? 'sync'
            : 'pending'
        await PageSync.query().where('page_number', pageNumber).update({
          pageStatus: statusText,
          itemsCount: countItems,
        })
      }
      statusSync.pageTotalSync = pagination.totalPages
      statusSync.itemsTotalSync = pagination.totalItems
      await statusSync.save()
    }
  }

  getItemsCountsPage(pageNumber: number, pagination: PaginationDto) {
    // Calcular la cantidad de ítems para la página actual
    let itemsCount
    if (pageNumber === pagination.totalPages) {
      const remainingItems = pagination.totalItems % pagination.pageSize
      itemsCount = remainingItems === 0 ? pagination.pageSize : remainingItems
    } else {
      itemsCount = pagination.pageSize
    }
    return itemsCount
  }

  async getPagesByPageRequest(page: number) {
    const pages = await PageSync.query()
      .where('page_number', '<=', page)
      .andWhere('page_status', 'pending')
      .orderBy('page_number', 'asc')
    const isLastPage = await this.isLastPage(page)
    if (pages.length === 0 && isLastPage) {
      return await PageSync.query().where('page_number', page)
    }
    return pages
  }

  async updatePageStatus(page: number) {
    // update pageSync where page_number is equal to page
    await PageSync.query().where('page_number', '<=', page).update({
      page_status: 'sync',
    })
  }

  async isLastPage(page: number) {
    const lastPage = await this.getLastPage()
    return lastPage?.pageNumber === page
  }

  async getLastPage() {
    return await PageSync.query().orderBy('page_number', 'desc').first()
  }

  async getLastPageSync(): Promise<PageSync | null> {
    const lastPageSync = await PageSync.query()
      .where('page_status', 'sync')
      .orderBy('page_number', 'desc')
      .first()

    if (!lastPageSync) {
      return await this.getLastPage()
    } else {
      return lastPageSync
    }
  }

  async index(
    params: {
      date: string
      dateEnd: string
      employeeID?: number
    },
    paginator?: { page: number; limit: number }
  ) {
    const intialSyncDate = '2024-01-01T00:00:00.000-06:00'
    const stringDate = `${params.date}T00:00:00.000-06:00`
    const time = DateTime.fromISO(stringDate, { setZone: true })
    const timeCST = time.setZone('America/Mexico_City')
    const filterInitialDate = timeCST.toFormat('yyyy-LL-dd HH:mm:ss')

    const stringEndDate = `${params.dateEnd}T23:59:59.000-06:00`
    const timeEnd = DateTime.fromISO(stringEndDate, { setZone: true })
    const timeEndCST = timeEnd.setZone('America/Mexico_City')
    const filterEndDate = timeEndCST.toFormat('yyyy-LL-dd HH:mm:ss')
    const query = Assist.query()

    if (params.date && !params.dateEnd) {
      query.where('assist_punch_time_origin', '>=', filterInitialDate)
    }

    if (params.dateEnd && params.date) {
      query.where('assist_punch_time_origin', '>=', filterInitialDate)
      query.where('assist_punch_time_origin', '<=', filterEndDate)
    }

    if (params.employeeID) {
      const employee = await Employee.query()
        .where('employee_id', params.employeeID || 0)
        .withTrashed()
        .first()

      if (!employee) {
        return {
          status: 400,
          type: 'warning',
          title: 'Invalid data',
          message: 'Employee not found',
          data: null,
        }
      }

      query.where('assist_emp_code', employee.employeeCode)
    }

    query.orderBy('assist_punch_time_origin', 'desc')
    const assistList = await query.paginate(paginator?.page || 1, paginator?.limit || 500)
    const assistListFlat = assistList.toJSON().data as AssistInterface[]
    const assistDayCollection: AssistDayInterface[] = []

    const serviceResponse = await new ShiftForEmployeeService().getEmployeeShifts(
      {
        dateStart: intialSyncDate,
        dateEnd: stringEndDate,
        employeeId: params.employeeID,
      },
      999999999999999,
      1
    )

    if (serviceResponse.status !== 200) {
      return serviceResponse
    }

    const dailyShifts: EmployeeRecordInterface[] =
      serviceResponse.status === 200
        ? ((serviceResponse.data?.data || []) as EmployeeRecordInterface[])
        : []

    const employeeShifts: ShiftRecordInterface[] = dailyShifts[0].employeeShifts as ShiftRecordInterface[]

    assistListFlat.forEach((item) => {
      const assist = item as AssistInterface
      const assistDate = DateTime.fromISO(`${assist.assistPunchTimeOrigin}`, {
        setZone: true,
      }).setZone('America/Mexico_city')

      const existDay = assistDayCollection.find(
        (itemAssistDay) => itemAssistDay.day === assistDate.toFormat('yyyy-LL-dd')
      )

      if (!existDay) {
        let dayAssist: AssistInterface[] = []
        assistListFlat.forEach((dayItem: AssistInterface, index) => {
          const currentDay = DateTime.fromISO(`${dayItem.assistPunchTimeOrigin}`, { setZone: true })
            .setZone('America/Mexico_city')
            .toFormat('yyyy-LL-dd')
          if (currentDay === assistDate.toFormat('yyyy-LL-dd')) {
            dayAssist.push(assistListFlat[index])
          }
        })

        dayAssist = dayAssist.sort(
          (a: any, b: any) => a.assistPunchTimeOrigin - b.assistPunchTimeOrigin
        )

        const dateShift = this.getAssignedDateShift(assist.assistPunchTimeOrigin, employeeShifts)

        assistDayCollection.push({
          day: assistDate.toFormat('yyyy-LL-dd'),
          assist: {
            checkIn: this.getCheckInDate(dayAssist),
            checkEatIn: this.getCheckEatInDate(dayAssist),
            checkEatOut: this.getCheckEatOutDate(dayAssist),
            checkOut: this.getCheckOutDate(dayAssist),
            dateShift: dateShift ? dateShift.shift : null,
            dateShiftApplySince: dateShift ? dateShift.employeShiftsApplySince : null,
            shiftCalculateFlag: dateShift ? dateShift.shiftCalculateFlag : '',
            checkInDateTime: null,
            checkOutDateTime: null,
            checkInStatus: '',
            checkOutStatus: '',
            isFutureDay: false,
            isSundayBonus: false,
            isRestDay: false,
            isVacationDate: false,
            isWorkDisabilityDate: false,
            isHoliday: false,
            holiday: null,
            hasExceptions: false,
            exceptions: [],
            assitFlatList: dayAssist,
          },
        })
      }
    })

    const employeeCalendar = await this.getEmployeeCalendar(
      timeCST,
      timeEndCST,
      assistDayCollection,
      employeeShifts,
      params.employeeID
    )

    return {
      status: 200,
      type: 'success',
      title: 'Successfully action',
      message: 'Success access data',
      data: {
        employeeCalendar,
      },
    }
  }

  private getAssignedDateShift(compareDateTime: Date | DateTime, dailyShifs: ShiftRecordInterface[]) {
    const DayTime = DateTime.fromISO(`${compareDateTime}`, { setZone: true })
    const checkTime = DayTime.setZone('America/Mexico_City')

    let availableShifts = dailyShifs.filter((shift) => {
      const shiftDate = DateTime.fromJSDate(new Date(shift.employeShiftsApplySince)).setZone(
        'America/Mexico_City'
      )

      if (checkTime >= shiftDate) {
        return shiftDate
      }
    })

    availableShifts = availableShifts.sort(
      (a: any, b: any) => b.employeShiftsApplySince - a.employeShiftsApplySince
    )

    const selectedShift = availableShifts[0]
    return selectedShift
  }

  private async getEmployeeCalendar(
    dateStart: Date | DateTime,
    dateEnd: Date | DateTime,
    employeeAssist: AssistDayInterface[],
    employeeShifts: ShiftRecordInterface[],
    employeeID: number | undefined
  ) {
    const dateTimeStart = DateTime.fromISO(`${dateStart}`, { setZone: true }).setZone(
      'America/Mexico_City'
    )

    const dateTimeEnd = DateTime.fromISO(`${dateEnd}`, { setZone: true }).setZone(
      'America/Mexico_City'
    )

    const daysBetween = Math.floor(dateTimeEnd.diff(dateTimeStart, 'days').days) + 1
    const assistList = employeeAssist
    const dailyAssistList: AssistDayInterface[] = []

    for (let index = 0; index < daysBetween; index++) {
      const currentDate = DateTime.fromISO(`${dateStart}`, { setZone: true }).setZone('America/Mexico_City').plus({ days: index })
      const dateShift = this.getAssignedDateShift(currentDate, employeeShifts)
      const fakeCheck: AssistDayInterface = {
        day: currentDate.toFormat('yyyy-LL-dd'),
        assist: {
          checkIn: null,
          checkOut: null,
          checkEatIn: null,
          checkEatOut: null,
          dateShift: dateShift ? dateShift.shift : null,
          dateShiftApplySince: dateShift ? dateShift.employeShiftsApplySince : null,
          shiftCalculateFlag: dateShift ? dateShift.shiftCalculateFlag : '',
          checkInDateTime: null,
          checkOutDateTime: null,
          checkInStatus: '',
          checkOutStatus: '',
          isFutureDay: false,
          isSundayBonus: false,
          isRestDay: false,
          isVacationDate: false,
          isWorkDisabilityDate: false,
          isHoliday: false,
          holiday: null,
          hasExceptions: false,
          exceptions: [],
          assitFlatList: [],
        },
      }

      dailyAssistList.push(fakeCheck)
    }

    let dailyAssistListCounter = 0

    const employee = await Employee.query()
      .where('employee_id', employeeID || 0)
      .first()

    const isDiscriminated = employee?.employeeAssistDiscriminator === 1

    for await (const item of dailyAssistList) {
      const date = assistList.find((assistDate) => assistDate.day === item.day)
      let dateAssistItem = date || item
      
      dateAssistItem.assist.isCheckOutNextDay = false
      dateAssistItem.assist.isCheckInEatNextDay = false
      dateAssistItem.assist.isCheckOutEatNextDay = false

      dateAssistItem = await this.setCheckInDateTime(dateAssistItem)
      dateAssistItem = await this.setCheckOutDateTime(dateAssistItem)
      dateAssistItem = await this.isExceptionDate(employeeID, dateAssistItem)
      
      dateAssistItem = await this.calculateRawCalendar(dateAssistItem, assistList)

      dateAssistItem = await this.checkInStatus(dateAssistItem, isDiscriminated)
      dateAssistItem = await this.checkOutStatus(dateAssistItem, isDiscriminated)

      dateAssistItem = await this.isSundayBonus(dateAssistItem)
      dateAssistItem = await this.isHoliday(dateAssistItem)
      dateAssistItem = await this.isVacationDate(employeeID, dateAssistItem)
      dateAssistItem = await this.isWorkDisabilityDate(employeeID, dateAssistItem)

      dateAssistItem = await this.validTime(dateAssistItem)
      dateAssistItem = await this.hasSomeExceptionTimeCheckIn(dateAssistItem)
      dateAssistItem = await this.hasSomeExceptionTimeCheckOut(dateAssistItem)

      dateAssistItem = await this.hasSomeException(employeeID, dateAssistItem)

      dailyAssistList[dailyAssistListCounter] = dateAssistItem
      dailyAssistListCounter = dailyAssistListCounter + 1
    }
    return dailyAssistList
  }

  private setCheckInDateTime (checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    const hourStart = checkAssist.assist.dateShift.shiftTimeStart
    const dateYear = checkAssist.day.split('-')[0].toString().padStart(2, '0')
    const dateMonth = checkAssist.day.split('-')[1].toString().padStart(2, '0')
    const dateDay = checkAssist.day.split('-')[2].toString().padStart(2, '0')
    const stringDate = `${dateYear}-${dateMonth}-${dateDay}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('America/Mexico_City').plus({ minutes: 1 })

    checkAssist.assist.checkInDateTime = timeToStart

    return checkAssist
  }

  private setCheckOutDateTime (checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    const hourStart = checkAssist.assist.dateShift.shiftTimeStart
    const dateYear = checkAssist.day.split('-')[0].toString().padStart(2, '0')
    const dateMonth = checkAssist.day.split('-')[1].toString().padStart(2, '0')
    const dateDay = checkAssist.day.split('-')[2].toString().padStart(2, '0')
    const stringDate = `${dateYear}-${dateMonth}-${dateDay}T${hourStart}.000-06:00`
    const timeToAdd = checkAssist.assist.dateShift.shiftActiveHours * 60 - 1
    const timeToEnd = DateTime.fromISO(stringDate, { setZone: true }).setZone('America/Mexico_City').plus({ minutes: timeToAdd })

    checkAssist.assist.checkOutDateTime = timeToEnd

    return checkAssist
  }

  private async checkInStatus(checkAssist: AssistDayInterface, discriminated?: Boolean) {
    const checkAssistCopy = checkAssist
    const { delayTolerance, faultTolerance } = await this.getTolerances()
    const TOLERANCE_DELAY_MINUTES = delayTolerance?.toleranceMinutes || 10
    const TOLERANCE_FAULT_MINUTES = faultTolerance?.toleranceMinutes || 30

    if (!checkAssist?.assist?.dateShift) {
      return checkAssistCopy
    }

    if (!checkAssist?.assist?.checkIn?.assistPunchTimeUtc) {
      checkAssistCopy.assist.checkInStatus = !checkAssist?.assist?.checkOut ? 'fault' : ''

      if (discriminated) {
        checkAssistCopy.assist.checkInStatus = ''
      }

      if (checkAssist.assist.exceptions.length > 0) {
        const absentException = checkAssist.assist.exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'absence-from-work')

        if (absentException) {
          checkAssistCopy.assist.checkInStatus = ''
          return checkAssistCopy
        }

        const changeShiftException = checkAssist.assist.exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'change-shift')

        if (changeShiftException) {
          checkAssistCopy.assist.checkInStatus = ''
          return checkAssistCopy
        }
      }

      return checkAssistCopy
    }

    const hourStart = checkAssist.assist.dateShift.shiftTimeStart
    const dateYear = checkAssist.day.split('-')[0].toString().padStart(2, '0')
    const dateMonth = checkAssist.day.split('-')[1].toString().padStart(2, '0')
    const dateDay = checkAssist.day.split('-')[2].toString().padStart(2, '0')
    const stringDate = `${dateYear}-${dateMonth}-${dateDay}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('America/Mexico_City').plus({ minutes: 1 })

    const DayTime = DateTime.fromISO(`${checkAssist.assist.checkIn.assistPunchTimeUtc}`, { setZone: true })
    const checkTime = DayTime.setZone('America/Mexico_city')
    const checkTimeTime = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
    const stringInDateString = `${dateYear}-${dateMonth}-${dateDay}T${checkTimeTime.padStart(8, '0')}.000-06:00`
    const timeCheckIn = DateTime.fromISO(stringInDateString, { setZone: true }).setZone('America/Mexico_City')

    const diffTime = timeCheckIn.diff(timeToStart, 'minutes').minutes

    if (diffTime > TOLERANCE_FAULT_MINUTES && !discriminated) {
      if (checkAssist.assist) {
        checkAssistCopy.assist.checkInStatus = 'fault'
      }

      if (checkAssist.assist.exceptions.length > 0) {
        const vacationException = checkAssist.assist.exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'vacation')

        if (vacationException) {
          checkAssistCopy.assist.checkInStatus = ''
        }
      }

      return checkAssistCopy
    }

    if (diffTime > TOLERANCE_DELAY_MINUTES) {
      checkAssistCopy.assist.checkInStatus = 'delay'
    }

    if (diffTime <= TOLERANCE_DELAY_MINUTES) {
      checkAssistCopy.assist.checkInStatus = 'tolerance'
    }

    if (diffTime <= 0) {
      checkAssistCopy.assist.checkInStatus = 'ontime'
    }

    if (discriminated) {
      checkAssistCopy.assist.checkInStatus = ''
    }

    return checkAssistCopy
  }

  private checkOutStatus(checkAssist: AssistDayInterface, discriminated?: Boolean) {
    const checkAssistCopy = checkAssist

    if (!checkAssist?.assist?.dateShift) {
      return checkAssistCopy
    }

    const hourStart = checkAssist.assist.dateShift.shiftTimeStart
    const dateYear = checkAssist.day.split('-')[0].toString().padStart(2, '0')
    const dateMonth = checkAssist.day.split('-')[1].toString().padStart(2, '0')
    const dateDay = checkAssist.day.split('-')[2].toString().padStart(2, '0')
    const stringDate = `${dateYear}-${dateMonth}-${dateDay}T${hourStart}.000-06:00`
    const timeToAdd = checkAssist.assist.dateShift.shiftActiveHours * 60 - 1
    const timeToEnd = DateTime.fromISO(stringDate, { setZone: true }).setZone('America/Mexico_City').plus({ minutes: timeToAdd })

    const currentNowTime = DateTime.now().setZone('America/Mexico_City')

    if (!checkAssist?.assist?.checkOut?.assistPunchTimeUtc) {
      checkAssistCopy.assist.checkOutStatus = checkAssistCopy.assist.checkInStatus === 'fault' ? 'fault' : ''
      return checkAssistCopy
    }

    const DayTime = DateTime.fromISO(`${checkAssist.assist.checkOut.assistPunchTimeUtc}`, { setZone: true })

    const checkTime = DayTime.setZone('America/Mexico_city')
    const checkTimeDateYear = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
    const checkTimeStringDate = `${checkTime.toFormat('yyyy-LL-dd')}T${checkTimeDateYear}.000-06:00`
    const timeToCheckOut = DateTime.fromISO(checkTimeStringDate, { setZone: true }).setZone('America/Mexico_City')
    const diffTime = timeToEnd.diff(timeToCheckOut, 'minutes').minutes
    const diffTimeNow = currentNowTime.diff(timeToEnd, 'minutes').minutes

    if (diffTime > 0 && diffTimeNow > 0) {
      if (checkAssistCopy.assist.assitFlatList?.length === 3) {
        checkAssistCopy.assist.checkEatOut = null
      }

      if (checkAssistCopy.assist.assitFlatList?.length === 2) {
        checkAssistCopy.assist.checkEatIn = null
      }
    }

    if (diffTime > 10 && (currentNowTime > timeToEnd)) {
      checkAssistCopy.assist.checkOutStatus = 'delay'
    }

    if (diffTime <= 10) {
      checkAssistCopy.assist.checkOutStatus = 'tolerance'
    }

    if (diffTime <= 0) {
      checkAssistCopy.assist.checkOutStatus = 'ontime'
    }

    if (discriminated) {
      checkAssistCopy.assist.checkOutStatus = ''
      return checkAssistCopy
    }

    return checkAssistCopy
  }

  private async getTolerances() {
    try {
      const data = await new ToleranceService().index()

      const delayTolerance = data.find((t) => t.toleranceName === 'Delay')
      const faultTolerance = data.find((t) => t.toleranceName === 'Fault')
      if (!delayTolerance || !faultTolerance) {
        throw new Error('No se encontraron tolerancias para Delay o Fault')
      }
      return { delayTolerance, faultTolerance }
    } catch (error) {
      console.error('Error al obtener las tolerancias:', error)
      throw error
    }
  }

  private isFutureDay(checkAssist: AssistDayInterface) {
    const checkAssistCopy = checkAssist

    if (!checkAssist?.assist?.dateShift) {
      // return checkAssistCopy
      return false
    }

    const now = DateTime.now().setZone('America/Mexico_City')
    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      // return checkAssistCopy
      return false
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('America/Mexico_City')
    const diff = now.diff(timeToStart, 'seconds').seconds

    checkAssistCopy.assist.isFutureDay = diff < 0
    // return checkAssistCopy
    return diff < 0
  }

  private isSundayBonus(checkAssist: AssistDayInterface) {
    const currentDate = DateTime.fromISO(`${checkAssist.day}T00:00:00.000-06:00`, { setZone: true }).setZone('America/Mexico_City')
    const naturalDay = currentDate.toFormat('c')
    checkAssist.assist.isSundayBonus = Number.parseInt(`${naturalDay}`) === 7 && !!checkAssist?.assist?.checkIn
    return checkAssist
  }

  private isRestDay(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.dateShift) {
      return false
    }

    const currentDate = DateTime.fromISO(`${checkAssist.day}T${checkAssist.assist.dateShift.shiftTimeStart}.000-06:00`, { setZone: true }).setZone('America/Mexico_City')
    const naturalDay = currentDate.toFormat('c')
    const restDay = checkAssist.assist.dateShift.shiftRestDays
      .split(',')
      .find((assistRestDay) => Number.parseInt(`${assistRestDay}`) === Number.parseInt(`${naturalDay}`))

    return !!restDay
  }

  private async isHoliday(checkAssist: AssistDayInterface) {
    const checkAssistCopy = checkAssist

    if (!checkAssist?.assist?.dateShift) {
      return checkAssistCopy
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssistCopy
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('America/Mexico_City')
    const service = await new HolidayService().index(timeToStart.toFormat('yyyy-LL-dd'), timeToStart.toFormat('yyyy-LL-dd'), '', 1, 100)

    checkAssistCopy.assist.isHoliday = service.status === 200 && service.holidays && service.holidays.length > 0 ? true : false

    checkAssistCopy.assist.holiday = service.status === 200 && service.holidays && service.holidays.length > 0
        ? (service.holidays[0] as unknown as HolidayInterface)
        : null

    if (checkAssistCopy.assist.isHoliday && !checkAssistCopy.assist.checkIn) {
      checkAssistCopy.assist.checkInStatus = ''
      checkAssistCopy.assist.checkOutStatus = ''
    }

    return checkAssistCopy
  }

  private async isExceptionDate(employeeID: number | undefined, checkAssist: AssistDayInterface) {
    if (!employeeID) {
      return checkAssist
    }

    const employee = await Employee.query()
      .where('employee_id', employeeID || 0)
      .first()

    if (!employee) {
      return checkAssist
    }

    const checkAssistCopy = checkAssist

    if (!checkAssist?.assist?.dateShift) {
      return checkAssistCopy
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssistCopy
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('America/Mexico_City')
    const startDate = `${timeToStart.toFormat('yyyy-LL-dd')} 00:00:00`
    const endDate = `${timeToStart.toFormat('yyyy-LL-dd')} 23:59:59`

    await employee.load('shift_exceptions', (query) => {
      query.where('shiftExceptionsDate', '>=', startDate)
      query.where('shiftExceptionsDate', '<=', endDate)
    })

    checkAssistCopy.assist.hasExceptions = employee.shift_exceptions.length > 0 ? true : false
    checkAssistCopy.assist.exceptions = employee.shift_exceptions as unknown as ShiftExceptionInterface[]

    return checkAssistCopy
  }

  private async hasSomeException(employeeID: number | undefined, checkAssist: AssistDayInterface) {
    if (!employeeID) {
      return checkAssist
    }

    const employee = await Employee.query()
      .where('employee_id', employeeID || 0)
      .first()

    if (!employee) {
      return checkAssist
    }

    const checkAssistCopy = checkAssist

    if (!checkAssist?.assist?.dateShift) {
      return checkAssistCopy
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssistCopy
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('America/Mexico_City')
    const startDate = `${timeToStart.toFormat('yyyy-LL-dd')} 00:00:00`
    const endDate = `${timeToStart.toFormat('yyyy-LL-dd')} 23:59:59`

    await employee.load('shift_exceptions', (query) => {
      query.where('shiftExceptionsDate', '>=', startDate)
      query.where('shiftExceptionsDate', '<=', endDate)
    })

    if (employee.shift_exceptions.length > 0) {
      const restException = employee.shift_exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'rest-day')
      const exWrongSystem = !!employee.shift_exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'error-de-horario-en-sistema')
      const exNewWorker = !!employee.shift_exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'nuevo-ingreso')
      const exIncapacity = !!employee.shift_exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'falta-por-incapacidad')
      const exMaternity = !!employee.shift_exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'incapacidad-por-maternidad')
      const exAbsentWork = !!employee.shift_exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'absence-from-work')

      if (exWrongSystem || exNewWorker || exIncapacity || exMaternity || exAbsentWork) {
        checkAssistCopy.assist.checkInStatus = 'exception'
        checkAssistCopy.assist.checkOutStatus = 'exception'
      }

      if (restException) {
        checkAssistCopy.assist.isRestDay = true
      }
    }

    return checkAssistCopy
  }

  private async isVacationDate(employeeID: number | undefined, checkAssist: AssistDayInterface) {
    if (!employeeID) {
      return checkAssist
    }

    const employee = await Employee.query()
      .where('employee_id', employeeID || 0)
      .first()

    if (!employee) {
      return checkAssist
    }

    const checkAssistCopy = checkAssist

    if (!checkAssist?.assist?.dateShift) {
      return checkAssistCopy
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssistCopy
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone(
      'America/Mexico_City'
    )

    const startDate = `${timeToStart.toFormat('yyyy-LL-dd')} 00:00:00`
    const endDate = `${timeToStart.toFormat('yyyy-LL-dd')} 23:59:59`

    await employee.load('shift_exceptions', (query) => {
      query.where('shiftExceptionsDate', '>=', startDate)
      query.where('shiftExceptionsDate', '<=', endDate)
    })

    if (employee.shift_exceptions.length > 0) {
      const absentException = employee.shift_exceptions.find(
        (ex) => ex.exceptionType?.exceptionTypeSlug === 'vacation'
      )

      if (absentException) {
        checkAssistCopy.assist.isVacationDate = true

        if (!checkAssistCopy.assist.checkIn) {
          checkAssistCopy.assist.checkInStatus = ''
          checkAssistCopy.assist.checkOutStatus = ''
        }
      }
    }

    return checkAssistCopy
  }

  private async isWorkDisabilityDate(employeeID: number | undefined, checkAssist: AssistDayInterface) {
    if (!employeeID) {
      return checkAssist
    }

    const employee = await Employee.query()
      .where('employee_id', employeeID || 0)
      .first()

    if (!employee) {
      return checkAssist
    }

    const checkAssistCopy = checkAssist

    if (!checkAssist?.assist?.dateShift) {
      return checkAssistCopy
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssistCopy
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone(
      'America/Mexico_City'
    )

    const startDate = `${timeToStart.toFormat('yyyy-LL-dd')} 00:00:00`
    const endDate = `${timeToStart.toFormat('yyyy-LL-dd')} 23:59:59`

    await employee.load('shift_exceptions', (query) => {
      query.where('shiftExceptionsDate', '>=', startDate)
      query.where('shiftExceptionsDate', '<=', endDate)
    })

    if (employee.shift_exceptions.length > 0) {
      const absentException = employee.shift_exceptions.find(
        (ex) => ex.exceptionType?.exceptionTypeSlug === 'falta-por-incapacidad'
      )

      if (absentException) {
        checkAssistCopy.assist.isWorkDisabilityDate = true

        if (!checkAssistCopy.assist.checkIn) {
          checkAssistCopy.assist.checkInStatus = ''
          checkAssistCopy.assist.checkOutStatus = ''
        }
      }
    }

    return checkAssistCopy
  }

  private getCheckInDate(dayAssist: AssistInterface[]) {
    const assist = dayAssist.length > 0 ? dayAssist[0] : null
    return assist
  }

  private getCheckEatInDate(dayAssist: AssistInterface[]) {
    let assist = null

    if (dayAssist.length > 1) {
      assist = dayAssist[1]
    }

    return assist
  }

  private getCheckEatOutDate(dayAssist: AssistInterface[]) {
    let assist = null

    if (dayAssist.length > 2) {
      assist = dayAssist[2]
    }

    return assist
  }

  private getCheckOutDate(dayAssist: AssistInterface[]) {
    let assist = null

    if (dayAssist.length > 1) {
      assist = dayAssist[dayAssist.length - 1]
    }

    return assist
  }

  private async calculateRawCalendar(dateAssistItem: AssistDayInterface, assistList: AssistDayInterface[]) {
    const lastTimeZoneLimit = DateTime.fromISO(`2024-10-26T00:00:00.000-06:00`).setZone('America/Mexico_City')
    const startDay = DateTime.fromJSDate(new Date(`${dateAssistItem.assist.dateShiftApplySince}`)).setZone('America/Mexico_City')
    const evaluatedDay = DateTime.fromISO(`${dateAssistItem.day}T00:00:00.000-06:00`).setZone('America/Mexico_City')
    const checkOutDateTime = DateTime.fromJSDate(new Date(`${dateAssistItem.assist.checkOutDateTime}`)).setZone('America/Mexico_City')

    const checkInDateTime = DateTime.fromJSDate(new Date(`${dateAssistItem.assist.checkInDateTime}`)).setZone('America/Mexico_City')
    const diffSinceLastTimeZoneLimit = lastTimeZoneLimit.diff(evaluatedDay, 'milliseconds').milliseconds
    const calendarDayStatus = await this.calendarDayStatus(dateAssistItem, evaluatedDay, startDay, dateAssistItem.assist.shiftCalculateFlag)

    let isStartWorkday = calendarDayStatus.isStartWorkday
    let isRestWorkday = calendarDayStatus.isRestWorkday

    dateAssistItem.assist.isFutureDay = calendarDayStatus.isNextDay

    if (dateAssistItem.assist.exceptions.length > 0) {
      const workRestDay = dateAssistItem.assist.exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'descanso-laborado')

      if (workRestDay) {
        isStartWorkday = true
        isRestWorkday = false

        if (dateAssistItem.assist.exceptions.length > 0) {
          dateAssistItem.assist.checkInStatus = ''
        }
      }

      const coverShiftDay = dateAssistItem.assist.exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'cover-shift')

      if (coverShiftDay) {
        isStartWorkday = true
        isRestWorkday = false

        if (dateAssistItem.assist.exceptions.length > 0) {
          dateAssistItem.assist.checkInStatus = ''
        }
      }
    }

    if (isStartWorkday) {
      const checkOutShouldbeNextDay = checkOutDateTime.toFormat('yyyy-LL-dd') > checkInDateTime.toFormat('yyyy-LL-dd')

      if (checkOutShouldbeNextDay) { // Validar si el check de salida debe ser al día siguiente

        dateAssistItem.assist.checkIn = null
        dateAssistItem.assist.checkEatIn = null
        dateAssistItem.assist.checkEatOut = null
        dateAssistItem.assist.checkOut = null
        
        if (dateAssistItem.assist.assitFlatList) {
          const calendarDay: AssistInterface[] = []
          const limitDateTimeCheckinFault = checkInDateTime.plus({ hours: 3 })

          dateAssistItem.assist.assitFlatList.forEach((checkItem) => {
            const punchTime = DateTime.fromISO(`${checkItem.assistPunchTimeUtc}`, { setZone: true }).setZone('America/Mexico_City')
            const diffToCheckStart = punchTime.diff(checkInDateTime.minus({ hours: diffSinceLastTimeZoneLimit > 0 ? 3 : 2 }), 'milliseconds').milliseconds

            if (diffToCheckStart > 0) {
              calendarDay.push(checkItem)
            }
          })

          if (calendarDay.length > 0) {
            dateAssistItem.assist.checkIn = calendarDay[0]
            dateAssistItem.assist.checkEatIn = calendarDay.length >= 2 ? calendarDay[1] : null
            dateAssistItem.assist.checkEatOut = calendarDay.length >= 3 ? calendarDay[2] : null
          }

          const nextEvaluatedDay = evaluatedDay.plus({ days: 1 }).toFormat('yyyy-LL-dd')
          const nextDay = assistList.find((assistDate) => assistDate.day === nextEvaluatedDay)

          if (nextDay && nextDay?.assist?.assitFlatList) {
            nextDay.assist.assitFlatList.forEach((checkItem) => {
              const punchTime = DateTime.fromISO(`${checkItem.assistPunchTimeUtc}`, { setZone: true }).setZone('America/Mexico_City')
              const diffToCheckOut = punchTime.diff(checkOutDateTime.plus({ hours: diffSinceLastTimeZoneLimit > 0 ? 3 : 2 }), 'milliseconds').milliseconds

              if (diffToCheckOut <= 0) {
                calendarDay.push(checkItem)
              }
            })
          }

          if (calendarDay.length > 0) {
            dateAssistItem.assist.checkIn = calendarDay[0]
            dateAssistItem.assist.checkEatIn = calendarDay.length > 2 ? calendarDay[1] : null
            dateAssistItem.assist.checkEatOut = calendarDay.length > 3 ? calendarDay[2] : null
            dateAssistItem.assist.checkOut = calendarDay.length >= 2 ? calendarDay[calendarDay.length - 1] : null
          }

          const checkinPunch = dateAssistItem.assist.checkIn ? DateTime.fromISO(`${dateAssistItem.assist.checkIn.assistPunchTimeUtc}`).setZone('America/Mexico_City') : null
          const diffLimitCheckinFault = checkinPunch ? checkinPunch.diff(limitDateTimeCheckinFault, 'milliseconds').milliseconds : 0

          if (calendarDay.length > 0 && diffLimitCheckinFault > 0) {
            dateAssistItem.assist.checkIn = null
            dateAssistItem.assist.checkEatIn = calendarDay.length > 0 ? calendarDay[0] : null
            dateAssistItem.assist.checkEatOut = calendarDay.length > 2 ? calendarDay[1] : null
            dateAssistItem.assist.checkOut = calendarDay.length >= 2 ? calendarDay[calendarDay.length - 1] : null
          }
        }
      }
    }

    if (dateAssistItem.assist.checkEatIn && DateTime.fromISO(`${dateAssistItem.assist.checkEatIn?.assistPunchTimeUtc}`).setZone('America/Mexico_City').plus({ hours: diffSinceLastTimeZoneLimit > 0 ? 1 : 0 }).toFormat('yyyy-LL-dd') > checkInDateTime.toFormat('yyyy-LL-dd')) {
      dateAssistItem.assist.isCheckInEatNextDay = true
    }

    if (dateAssistItem.assist.checkEatOut && DateTime.fromISO(`${dateAssistItem.assist.checkEatOut?.assistPunchTimeUtc}`).setZone('America/Mexico_City').plus({ hours: diffSinceLastTimeZoneLimit > 0 ? 1 : 0 }).toFormat('yyyy-LL-dd') > checkInDateTime.toFormat('yyyy-LL-dd')) {
      dateAssistItem.assist.isCheckOutEatNextDay = true
    }

    if (dateAssistItem.assist.checkOut && DateTime.fromISO(`${dateAssistItem.assist.checkOut?.assistPunchTimeUtc}`).setZone('America/Mexico_City').plus({ hours: diffSinceLastTimeZoneLimit > 0 ? 1 : 0 }).toFormat('yyyy-LL-dd') > checkInDateTime.toFormat('yyyy-LL-dd')) {
      dateAssistItem.assist.isCheckOutNextDay = true
    }

    if (!dateAssistItem.assist.checkIn) {
      dateAssistItem.assist.checkInStatus = 'fault'
    }

    if (!dateAssistItem.assist.checkOut) {
      dateAssistItem.assist.checkOutStatus = 'fault'
    }

    if (isRestWorkday) {
      dateAssistItem.assist.isRestDay = true
      dateAssistItem.assist.checkInStatus = ''
      dateAssistItem.assist.checkOutStatus = ''

      if (dateAssistItem.assist.checkIn) {
        dateAssistItem.assist.checkIn = null
        dateAssistItem.assist.checkEatIn = null
        dateAssistItem.assist.checkEatOut = null
        dateAssistItem.assist.checkOut = null
      }
    }

    if (diffSinceLastTimeZoneLimit > 0) {
      if (dateAssistItem.assist.checkIn) {
        dateAssistItem.assist.checkIn.assistPunchTimeUtc = DateTime.fromISO(`${dateAssistItem.assist.checkIn.assistPunchTimeUtc}`).plus({ hours: 1 }).toJSDate()
      }

      if (dateAssistItem.assist.checkEatIn) {
        dateAssistItem.assist.checkEatIn.assistPunchTimeUtc = DateTime.fromISO(`${dateAssistItem.assist.checkEatIn.assistPunchTimeUtc}`).plus({ hours: 1 }).toJSDate()
      }

      if (dateAssistItem.assist.checkEatOut) {
        dateAssistItem.assist.checkEatOut.assistPunchTimeUtc = DateTime.fromISO(`${dateAssistItem.assist.checkEatOut.assistPunchTimeUtc}`).plus({ hours: 1 }).toJSDate()
      }

      if (dateAssistItem.assist.checkOut) {
        dateAssistItem.assist.checkOut.assistPunchTimeUtc = DateTime.fromISO(`${dateAssistItem.assist.checkOut.assistPunchTimeUtc}`).plus({ hours: 1 }).toJSDate()
      }
    }

    dateAssistItem.assist.checkOutStatus = ''

    return JSON.parse(JSON.stringify(dateAssistItem)) as AssistDayInterface
  }

  private async calendarDayStatus (dateAssistItem: AssistDayInterface, evaluatedDay: DateTime, startDay: DateTime, flag: string) {
    let daysBettweenStart = 0
    let isStartWorkday = true
    let isEndWorkday = false
    let isRestWorkday = false
    let isNextDay = this.isFutureDay(dateAssistItem)

    if (flag === 'doble-12x48') {
      daysBettweenStart = evaluatedDay.diff(startDay, 'days').days
      isStartWorkday = !!(daysBettweenStart % 4 === 0 || daysBettweenStart % 4 === 1)
      isEndWorkday = !!(daysBettweenStart % 4 === 1)
      isRestWorkday = !!(daysBettweenStart % 4 === 3 || daysBettweenStart % 4 === 2)
    } else if (flag === '24x48') {
      daysBettweenStart = evaluatedDay.diff(startDay, 'days').days
      isStartWorkday = !!(daysBettweenStart % 3 === 0)
      isRestWorkday = !!(daysBettweenStart % 3 === 2) || !!(daysBettweenStart % 3 === 1)
    } else if (flag === '12x36') {
      daysBettweenStart = evaluatedDay.diff(startDay, 'days').days
      isStartWorkday = !!(daysBettweenStart % 2 === 0)
      isRestWorkday = !!(daysBettweenStart % 2 === 1)
    } else if (flag === '24x24') {
      daysBettweenStart = Math.floor(evaluatedDay.diff(startDay, 'days').days)
      isStartWorkday = !!(daysBettweenStart % 2 === 0)
      isRestWorkday = !!(daysBettweenStart % 2 === 1)
    } else {
      isRestWorkday = this.isRestDay(dateAssistItem)
    }

    return {
      isStartWorkday,
      isEndWorkday,
      isRestWorkday,
      isNextDay
    }
  }

  private async hasSomeExceptionTimeCheckIn(checkAssist: AssistDayInterface) {
    if (!checkAssist) {
      return checkAssist
    }
    const checkAssistCopy = checkAssist
    //if (checkAssist.assist.dateShift && !checkAssist.assist.dateShift?.shiftCalculateFlag) {
    if (checkAssist.assist.dateShift) {
      if (checkAssist.assist.exceptions.length > 0) {
        const exception = checkAssist.assist.exceptions.find(
          (ex) => ex.shiftExceptionCheckInTime
        )

        if (exception) {
          
          const dateYear = checkAssist.day.split('-')[0].toString().padStart(2, '0')
          const dateMonth = checkAssist.day.split('-')[1].toString().padStart(2, '0')
          const dateDay = checkAssist.day.split('-')[2].toString().padStart(2, '0')
          const DayTime = DateTime.fromISO(`${checkAssist.assist.checkIn?.assistPunchTimeOrigin}`, {
            setZone: true,
          })
          const checkTime = DayTime.setZone('America/Mexico_city')
          const checkTimeTime = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
          const stringInDateString = `${dateYear}-${dateMonth}-${dateDay}T${checkTimeTime.padStart(8, '0')}.000-06:00`
          const timeCheckIn = DateTime.fromISO(stringInDateString, { setZone: true }).setZone(
            'America/Mexico_City'
          )
          const { delayTolerance } = await this.getTolerances()
          const TOLERANCE_DELAY_MINUTES = delayTolerance?.toleranceMinutes || 10
          if (exception.shiftExceptionCheckInTime) {
            const shiftExceptionCheckInTime = DateTime.fromFormat(exception.shiftExceptionCheckInTime, 'HH:mm:ss')
            const diffTime = timeCheckIn.diff(
              timeCheckIn.set({
                hour: shiftExceptionCheckInTime.hour,
                minute: shiftExceptionCheckInTime.minute,
              }),
              'minutes'
            ).as('minutes')
            if (diffTime > TOLERANCE_DELAY_MINUTES) {
              checkAssistCopy.assist.checkInStatus = 'delay'
            }
        
            if (diffTime <= TOLERANCE_DELAY_MINUTES) {
              checkAssistCopy.assist.checkInStatus = 'tolerance'
            }
        
            if (diffTime <= 0) {
              checkAssistCopy.assist.checkInStatus = 'ontime'
            }
          }
        }
      }
    }
    return checkAssistCopy
  }

  private async validTime(checkAssist: AssistDayInterface) {
    if (!checkAssist) {
      return checkAssist
    }
    const checkAssistCopy = checkAssist
    if (checkAssistCopy.assist.checkIn?.assistId === checkAssistCopy.assist.checkOut?.assistId ) {
      checkAssistCopy.assist.checkOut = null
    }
    return checkAssistCopy
  }

  private async hasSomeExceptionTimeCheckOut(checkAssist: AssistDayInterface) {
    if (!checkAssist) {
      return checkAssist
    }
    const checkAssistCopy = checkAssist

    //if (checkAssist.assist.dateShift && !checkAssist.assist.dateShift?.shiftCalculateFlag) {
      if (checkAssist.assist.dateShift) {
      if (checkAssist.assist.exceptions.length > 0) {
     
        const exception = checkAssist.assist.exceptions.find(
          (ex) => ex.shiftExceptionCheckOutTime
        )

        if (exception) {

          if (!checkAssist?.assist?.checkOut?.assistPunchTimeOrigin) {
            checkAssistCopy.assist.checkOutStatus = checkAssistCopy.assist.checkInStatus === 'fault' ? 'fault' : ''
            return checkAssistCopy
          }

          const DayTime = DateTime.fromISO(`${checkAssist.assist.checkOut.assistPunchTimeOrigin}`, {
            setZone: true,
          })

          const checkTime = DayTime.setZone('America/Mexico_city')
          const checkTimeDateYear = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
          const checkTimeStringDate = `${checkTime.toFormat('yyyy-LL-dd')}T${checkTimeDateYear}.000-06:00`
          const timeToCheckOut = DateTime.fromISO(checkTimeStringDate, { setZone: true }).setZone(
            'America/Mexico_City'
          )

          if (exception.shiftExceptionCheckOutTime) {
            const shiftExceptionCheckOutTime = DateTime.fromFormat(exception.shiftExceptionCheckOutTime, 'HH:mm:ss')
            const diffTime = timeToCheckOut.diff(
              timeToCheckOut.set({
                hour: shiftExceptionCheckOutTime.hour,
                minute: shiftExceptionCheckOutTime.minute,
              }),
              'minutes'
            ).as('minutes')
            if (diffTime > 0) {
              checkAssistCopy.assist.checkOutStatus = 'ontime'
            } else if (diffTime >= -10) {
              checkAssistCopy.assist.checkOutStatus = 'tolerance'
            } else if (diffTime < -10) {
              checkAssistCopy.assist.checkOutStatus = 'delay'
            }
          }
        }
      }
    }
    return checkAssistCopy
   }
}
