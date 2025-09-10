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
import SystemSettingService from './system_setting_service.js'
import SystemSetting from '#models/system_setting'
import Tolerance from '#models/tolerance'
import { ShiftInterface } from '../interfaces/shift_interface.js'
import { SyncAssistsServiceIndexInterface } from '../interfaces/sync_assists_service_index_interface.js'
import EmployeeAssistCalendar from '#models/employee_assist_calendar'
import Department from '#models/department'
import BusinessUnit from '#models/business_unit'
import DepartmentService from './department_service.js'
import EmployeeService from './employee_service.js'
export default class SyncAssistsService {
  /**
   * Retrieves the status sync of assists.
   * @returns {Promise<AssistStatusResponseDto>} The assist status response DTO.
   */
  /* private t: (key: string,params?: { [key: string]: string | number }) => string

  constructor(i18n: any) {
    this.t = i18n.formatMessage.bind(i18n)
  } */
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
    // const year = dateParam.getUTCFullYear()
    // const month = String(dateParam.getUTCMonth() + 1).padStart(2, '0')
    // const day = String(dateParam.getUTCDate()).padStart(2, '0')
    // const dateStart = `${year}-${month}-${day}`

    // const today = DateTime.utc().toISODate()
    // await this.syncronizeAssistAllEmployeesCalendar(dateStart, today)
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
    const employee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_code', filters.empCode)
      .first()
    if (employee) {


      const filter: SyncAssistsServiceIndexInterface = {
        date: filters.startDate,
        dateEnd: filters.endDate,
        employeeID: employee.employeeId
      }
      await this.setDateCalendar(filter)
    }
    return response
  }

  async handleSyncAssists(statusSync: AssistStatusSync, dateParam: Date, page: number = 1, limit: number = 50) {
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
      .where('assist_active', 1)
      .where('assistPunchTimeUtc', '>', dateParam)
      .orderBy('assistPunchTimeUtc', 'asc')
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

  async fetchExternalData(startDate: Date, page: number, limit: number = 50): Promise<ResponseApiAssistsDto> {
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

  async setDateCalendar (filters: SyncAssistsServiceIndexInterface) {
    if (filters.employeeID !== undefined) {
      const empCalendar = await this.index(filters)
      if (empCalendar && empCalendar.status === 200 && empCalendar.data) {
        const calendarDayRes = empCalendar.data as any
        const calendarDay = calendarDayRes.employeeCalendar as AssistDayInterface[]
        calendarDay.forEach(async (calendarObject: AssistDayInterface) => {
          const existEmployeeAssistCalendar = await EmployeeAssistCalendar.query()
            .whereNull('employee_assist_calendar_deleted_at')
            .where('employee_id' , filters.employeeID as number)
            .where('day' , calendarObject.day)
            .first()
          let employeeAssistCalendar = new EmployeeAssistCalendar()
          if (existEmployeeAssistCalendar) {
            employeeAssistCalendar = existEmployeeAssistCalendar
          }

          employeeAssistCalendar.day = calendarObject.day
          employeeAssistCalendar.employeeId = filters.employeeID as number
          employeeAssistCalendar.checkInAssistId = calendarObject.assist.checkIn ? calendarObject.assist.checkIn.assistId : null
          employeeAssistCalendar.checkInDateTime = calendarObject.assist.checkInDateTime?.toISO() || null
          employeeAssistCalendar.checkInStatus = calendarObject.assist.checkInStatus
          employeeAssistCalendar.checkOutAssistId = calendarObject.assist.checkOut ? calendarObject.assist.checkOut.assistId : null
          employeeAssistCalendar.checkOutDateTime = calendarObject.assist.checkOutDateTime?.toISO() || null
          employeeAssistCalendar.checkOutStatus = calendarObject.assist.checkOutStatus
          employeeAssistCalendar.checkEatInAssistId = calendarObject.assist.checkEatIn ? calendarObject.assist.checkEatIn.assistId : null
          employeeAssistCalendar.checkEatOutAssistId = calendarObject.assist.checkEatOut ? calendarObject.assist.checkEatOut.assistId : null
          employeeAssistCalendar.shiftId = calendarObject.assist.dateShift?.shiftId || null
          employeeAssistCalendar.shiftIsChange = calendarObject.assist.dateShift?.shiftIsChange ? calendarObject.assist.dateShift?.shiftIsChange : false
          employeeAssistCalendar.hasExceptions = calendarObject.assist.hasExceptions
          employeeAssistCalendar.holidayId = calendarObject.assist.holiday?.holidayId || null
          employeeAssistCalendar.isBirthday = calendarObject.assist.isBirthday
          employeeAssistCalendar.isCheckInEatNextDay = calendarObject.assist.isCheckInEatNextDay ? calendarObject.assist.isCheckInEatNextDay : false
          employeeAssistCalendar.isCheckOutEatNextDay = calendarObject.assist.isCheckOutEatNextDay ? calendarObject.assist.isCheckOutEatNextDay : false
          employeeAssistCalendar.isCheckOutNextDay = calendarObject.assist.isCheckOutNextDay ? calendarObject.assist.isCheckOutNextDay : false
          employeeAssistCalendar.isFutureDay = calendarObject.assist.isFutureDay
          employeeAssistCalendar.isHoliday = calendarObject.assist.isHoliday
          employeeAssistCalendar.isRestDay = calendarObject.assist.isRestDay
          employeeAssistCalendar.isSundayBonus = calendarObject.assist.isSundayBonus
          employeeAssistCalendar.isVacationDate = calendarObject.assist.isVacationDate
          employeeAssistCalendar.isWorkDisabilityDate = calendarObject.assist.isWorkDisabilityDate
          employeeAssistCalendar.shiftCalculateFlag = calendarObject.assist.shiftCalculateFlag
          employeeAssistCalendar.hasAssitFlatList = calendarObject.assist.assitFlatList && calendarObject.assist.assitFlatList?.length > 0 ? true : false
          await employeeAssistCalendar.save()
        })
      } else if (empCalendar && empCalendar.status === 400 && empCalendar.title === 'no_employee_shifts') {
        const start = DateTime.fromISO(filters.date)
        const end = DateTime.fromISO(filters.dateEnd)

        let current = start

        while (current <= end) {
         if (current) {
          const day = current.toFormat('yyyy-MM-dd')
          const existEmployeeAssistCalendar = await EmployeeAssistCalendar.query()
            .whereNull('employee_assist_calendar_deleted_at')
            .where('employee_id' , filters.employeeID as number)
            .where('day' , day)
            .first()

          if (!existEmployeeAssistCalendar) {
            const employeeAssistCalendar = new EmployeeAssistCalendar()
            employeeAssistCalendar.day = day
            employeeAssistCalendar.employeeId = filters.employeeID as number
            employeeAssistCalendar.checkInAssistId = null
            employeeAssistCalendar.checkInDateTime = null
            employeeAssistCalendar.checkInStatus = ''
            employeeAssistCalendar.checkOutAssistId = null
            employeeAssistCalendar.checkOutDateTime = null
            employeeAssistCalendar.checkOutStatus = ''
            employeeAssistCalendar.checkEatInAssistId = null
            employeeAssistCalendar.checkEatOutAssistId = null
            employeeAssistCalendar.shiftId = null
            employeeAssistCalendar.shiftIsChange = false
            employeeAssistCalendar.hasExceptions = false
            employeeAssistCalendar.holidayId = null
            employeeAssistCalendar.isBirthday = false
            employeeAssistCalendar.isCheckInEatNextDay = false
            employeeAssistCalendar.isCheckOutEatNextDay = false
            employeeAssistCalendar.isCheckOutNextDay = false
            employeeAssistCalendar.isFutureDay = false
            employeeAssistCalendar.isHoliday = false
            employeeAssistCalendar.isRestDay = false
            employeeAssistCalendar.isSundayBonus = false
            employeeAssistCalendar.isVacationDate = false
            employeeAssistCalendar.isWorkDisabilityDate = false
            employeeAssistCalendar.shiftCalculateFlag = null
            employeeAssistCalendar.hasAssitFlatList = false
            await employeeAssistCalendar.save()
          }
         }
         current = current.plus({ days: 1 })
        }
      }
    }

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

  async index (bodyParams: SyncAssistsServiceIndexInterface, paginator?: { page: number; limit: number }) {
    const intialSyncDate = '2024-01-01T00:00:00.000-06:00'
    const stringDate = `${bodyParams.date}T00:00:00.000-06:00`
    const time = DateTime.fromISO(stringDate, { setZone: true })
    const timeCST = time.setZone('UTC-6')
    const filterInitialDate = timeCST.toFormat('yyyy-LL-dd HH:mm:ss')
    const stringEndDate = `${bodyParams.dateEnd}T23:59:59.000-06:00`
    const timeEnd = DateTime.fromISO(stringEndDate, { setZone: true })
    const timeEndCST = timeEnd.setZone('UTC-6').plus({ days: 1 })
    const filterEndDate = timeEndCST.toFormat('yyyy-LL-dd HH:mm:ss')
    const query = Assist.query()
      .where('assist_active', 1)
    let employee = null

    if (bodyParams.date && !bodyParams.dateEnd) {
      query.where('assist_punch_time_origin', '>=', filterInitialDate)
    }

    if (bodyParams.dateEnd && bodyParams.date) {
      query.where('assist_punch_time_origin', '>=', filterInitialDate)
      query.where('assist_punch_time_origin', '<', filterEndDate)
    }

    if (bodyParams.employeeID) {
      employee = await Employee.query()
        .where('employee_id', bodyParams.employeeID || 0)
        .if(bodyParams.withOutExternal, (subQuery) => {
          subQuery.where('employee_type_of_contract', 'Internal')
        })
        .withTrashed()
        .first()
      if (!employee) {
        // const entity = this.t('employee')
        return {
          status: 400,
          type: 'warning',
          title: 'not found',//this.t('entity_was_not_found', { entity }),
          message: 'not found', //this.t('entity_was_not_found', { entity }),
          data: null,
        }
      }

      query.where('assist_emp_code', employee.employeeCode)
    }
    query.orderBy('assist_punch_time_origin', 'desc')

    const assistDayCollection: AssistDayInterface[] = []
    const endDate = timeEndCST.minus({ days: 1 })
    const employeeShiftFilter = { dateStart: intialSyncDate, dateEnd: stringEndDate, employeeId: bodyParams.employeeID }
    const serviceResponse = await new ShiftForEmployeeService().getEmployeeShifts(employeeShiftFilter, 999999999999999, 1)

    if (serviceResponse.status !== 200) {
      return serviceResponse
    }

    const dailyShifts: EmployeeRecordInterface[] = serviceResponse.status === 200 ? ((serviceResponse.data?.data || []) as EmployeeRecordInterface[]) : []
    const employeeShifts: ShiftRecordInterface[] = dailyShifts[0].employeeShifts as ShiftRecordInterface[]
    const assistList = await query.paginate(paginator?.page || 1, paginator?.limit || 500)
    const assistListFlat  = assistList.toJSON().data as AssistInterface[]

    for await (const item of assistListFlat) {
      const assist = item as AssistInterface
      const assistDate = DateTime.fromISO(`${assist.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6')
      const existDay = assistDayCollection.find((itemAssistDay) => itemAssistDay.day === assistDate.toFormat('yyyy-LL-dd'))

      if (!existDay) {
        let dayAssist: AssistInterface[] = []

        for await (const [index, dayItem] of assistListFlat.entries()) {
          const currentDay = DateTime.fromISO(`${dayItem.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6').toFormat('yyyy-LL-dd')

          if (currentDay === assistDate.toFormat('yyyy-LL-dd')) {
            // const isSummerTime = this.checkDSTSummerTime(new Date(currentDay))
            assistListFlat[index].assistUsed = false

            // let assistPunchTime = DateTime.fromISO(`${dayItem.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6').toFormat('HH:mm:ss')

            // if (isSummerTime) {
            //   assistPunchTime = DateTime.fromISO(`${dayItem.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6').plus({ hour: 1 }).toFormat('HH:mm:ss')
            // }

            // const today = DateTime.now().setZone('UTC-6').toFormat('yyyy-MM-dd')
            // const checkInDateTime = DateTime.fromISO(`${today}T${assistPunchTime}`, { zone: 'UTC-6' })
            // const checkInTimeOnly = DateTime.fromObject({
            //   hour: checkInDateTime.hour,
            //   minute: checkInDateTime.minute,
            //   second: checkInDateTime.second,
            // })

            if (employee) {
              const previousDay = DateTime.fromISO(`${dayItem.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6').minus({ day: 1 }).toFormat('yyyy-LL-dd')
              const stringDatePrevious = `${previousDay}T00:00:00.000-06:00`
              const timeToStartPrevious = DateTime.fromISO(stringDatePrevious, { setZone: true }).setZone('UTC-6')
              const startDatePrevious = `${timeToStartPrevious.toFormat('yyyy-LL-dd')} 00:00:00`
              const endDatePrevious = `${timeToStartPrevious.toFormat('yyyy-LL-dd')} 23:59:59`

              employee.$setRelated('shiftChanges', [])

              await employee.load('shiftChanges', (queryShiftChange) => {
                queryShiftChange.where('employeeShiftChangeDateFrom', '>=', startDatePrevious)
                queryShiftChange.where('employeeShiftChangeDateFrom', '<=', endDatePrevious)
              })

              // if (employee.shiftChanges.length > 0) {
              //   if (employee.shiftChanges[0].shiftTo) {
              //     const shift = employee.shiftChanges[0].shiftTo
              //     const shiftTimeStart = shift.shiftTimeStart
              //     const shiftActiveHours = shift.shiftActiveHours

              //     const shiftStart = DateTime.fromISO(`${previousDay}T${shiftTimeStart}`)
              //     const shiftEnd = shiftStart.plus({ hours: shiftActiveHours })

              //     const checkInHour = checkInTimeOnly.hour + checkInTimeOnly.minute / 60
              //     const shiftEndHour = shiftEnd.hour + shiftEnd.minute / 60
              //     const hourDifference = Math.abs(checkInHour - shiftEndHour)

              //     if (hourDifference >= 0 && hourDifference <= 2) {
              //       assistListFlat[index].assistUsed = true
              //     }
              //   }
              // }
            }

            dayAssist.push(assistListFlat[index])
          }
        }

        dayAssist = dayAssist.sort((a: any, b: any) => a.assistPunchTimeUtc - b.assistPunchTimeUtc)
        const dateShift = this.getAssignedDateShift(assist.assistPunchTimeUtc, employeeShifts)

        assistDayCollection.push({
          day: assistDate.toFormat('yyyy-LL-dd'),
          assist: {
            checkIn: this.getCheckInDate(dayAssist),
            checkEatIn: this.getCheckEatInDate(dayAssist),
            checkEatOut: this.getCheckEatOutDate(dayAssist),
            checkOut: this.getCheckOutDate(dayAssist),
            dateShift: dateShift ? dateShift.shift : null,
            dateShiftApplySince: dateShift ? dateShift.employeShiftsApplySince : null,
            employeeShiftId: dateShift ? dateShift.employeeShiftId : null,
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
            isBirthday: false,
            holiday: null,
            hasExceptions: false,
            exceptions: [],
            assitFlatList: dayAssist,
          },
        })
      }
    }

    const { delayTolerance, faultTolerance } = await this.getTolerances()
    const TOLERANCE_DELAY_MINUTES = delayTolerance?.toleranceMinutes || 10
    const TOLERANCE_FAULT_MINUTES = faultTolerance?.toleranceMinutes || 30

    const employeeCalendar = await this.getEmployeeCalendar(
      timeCST,
      endDate,
      assistDayCollection,
      employeeShifts,
      bodyParams.employeeID,
      TOLERANCE_DELAY_MINUTES,
      TOLERANCE_FAULT_MINUTES,
      employee
    )


    return {
      status: 200,
      type: 'success',
      title: 'resources',//this.t('resources'),
      message: 'resources_were_found_successfully',//this.t('resources_were_found_successfully'),
      data: {
        employeeCalendar,
      },
    }
  }

  private getAssignedDateShift(compareDateTime: Date | DateTime, dailyShifs: ShiftRecordInterface[]) {
    const DayTime = DateTime.fromISO(`${compareDateTime}`, { setZone: true })
    const checkTime = DayTime.setZone('UTC-6')

    let availableShifts = dailyShifs.filter((shift) => {
      const shiftDate = DateTime.fromJSDate(new Date(shift.employeShiftsApplySince)).setZone('UTC-6')

      if (checkTime >= shiftDate) {
        return shiftDate
      }
    })

    availableShifts = availableShifts.sort((a: any, b: any) => b.employeShiftsApplySince - a.employeShiftsApplySince)

    const selectedShift = availableShifts[0]
    return selectedShift
  }

  private async getEmployeeCalendar(
    dateStart: Date | DateTime,
    dateEnd: Date | DateTime,
    employeeAssist: AssistDayInterface[],
    employeeShifts: ShiftRecordInterface[],
    employeeID: number | undefined,
    TOLERANCE_DELAY_MINUTES: number,
    TOLERANCE_FAULT_MINUTES: number,
    employee: Employee | null
  ) {
    if (employee) {
      await employee.load('person')
    }
    const dateTimeStart = DateTime.fromISO(`${dateStart}`, { setZone: true }).setZone('UTC-6')
    const dateTimeEnd = DateTime.fromISO(`${dateEnd}`, { setZone: true }).setZone('UTC-6')

    const daysBetween = Math.floor(dateTimeEnd.diff(dateTimeStart, 'days').days) + 1
    const assistList = employeeAssist
    const dailyAssistList: AssistDayInterface[] = []

    for (let index = 0; index < daysBetween; index++) {
      const currentDate = DateTime.fromISO(`${dateStart}`, { setZone: true }).setZone('UTC-6').plus({ days: index })
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
          employeeShiftId: dateShift ? dateShift.employeeShiftId : null,
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
          isBirthday: false,
          holiday: null,
          hasExceptions: false,
          exceptions: [],
          assitFlatList: [],
        },
      }

      dailyAssistList.push(fakeCheck)
    }

    let dailyAssistListCounter = 0

    const isDiscriminated = employee?.employeeAssistDiscriminator === 1

    for await (const item of dailyAssistList) {
      const date = assistList.find((assistDate) => assistDate.day === item.day)
      let dateAssistItem = date || item

      dateAssistItem.assist.isCheckOutNextDay = false
      dateAssistItem.assist.isCheckInEatNextDay = false
      dateAssistItem.assist.isCheckOutEatNextDay = false

      await Promise.all([
        this.isHoliday(dateAssistItem),
        this.hasOtherShift(employeeID, dateAssistItem, employee),
        this.isBirthday(dateAssistItem, employee),
        this.isExceptionDate(employeeID, dateAssistItem, employee)
      ])

      this.setCheckInDateTime(dateAssistItem)
      this.setCheckOutDateTime(dateAssistItem)
      this.calculateRawCalendar(dateAssistItem, assistList)
      this.checkInStatus(dateAssistItem, TOLERANCE_FAULT_MINUTES, TOLERANCE_DELAY_MINUTES, isDiscriminated)
      this.checkOutStatus(dateAssistItem, isDiscriminated)
      this.isSundayBonus(dateAssistItem)
      this.isVacationDate(employeeID, dateAssistItem, employee)
      this.isWorkDisabilityDate(employeeID, dateAssistItem, employee)
      this.validTime(dateAssistItem)
      this.hasSomeExceptionTimeCheckIn(dateAssistItem, TOLERANCE_DELAY_MINUTES)
      this.hasSomeExceptionTimeCheckOut(dateAssistItem)
      this.hasSomeException(employeeID, dateAssistItem, employee)
      this.verifyCheckOutToday(dateAssistItem)

      if (dateAssistItem.assist.dateShift) {
        const isShiftChanged = dateAssistItem.assist.dateShift.shiftIsChange
        const shift = JSON.parse(JSON.stringify(dateAssistItem.assist.dateShift))
        shift.shiftIsChange = isShiftChanged
        dateAssistItem.assist.dateShift = shift
      }

      dailyAssistList[dailyAssistListCounter] = dateAssistItem
      dailyAssistListCounter = dailyAssistListCounter + 1
    }

    return dailyAssistList
  }

  private async isHoliday(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssist
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('UTC-6')
    const service = await new HolidayService().index(timeToStart.toFormat('yyyy-LL-dd'), timeToStart.toFormat('yyyy-LL-dd'), '', 1, 100)
    const holidayresponse =  service.status === 200 && service.holidays && service.holidays.length > 0 ? service.holidays[0] : null

    checkAssist.assist.holiday = holidayresponse as unknown as HolidayInterface
    checkAssist.assist.isHoliday = !!(holidayresponse)

    return checkAssist
  }

  private async isBirthday(checkAssist: AssistDayInterface, employee: Employee | null) {
    if (!employee?.person.personBirthday) {
      return checkAssist
    }
    const rawDate = employee.person.personBirthday

    const birthday = typeof rawDate === 'string'
      ? DateTime.fromISO(rawDate)
      : DateTime.fromJSDate(rawDate)
    const currentDate = DateTime.fromISO(checkAssist.day)

    checkAssist.assist.isBirthday = birthday.month === currentDate.month && birthday.day === currentDate.day
    return checkAssist
  }

  private async hasOtherShift(employeeID: number | undefined, checkAssist: AssistDayInterface, employee: Employee | null) {
    if (!employeeID) {
      return checkAssist
    }

    if (!employee) {
      return checkAssist
    }

    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    checkAssist.assist.dateShift.shiftIsChange = false

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssist
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('UTC-6')
    const startDate = `${timeToStart.toFormat('yyyy-LL-dd')} 00:00:00`
    const endDate = `${timeToStart.toFormat('yyyy-LL-dd')} 23:59:59`
    await employee.load('shiftChanges', (query) => {
      query.where('employeeShiftChangeDateFrom', '>=', startDate)
      query.where('employeeShiftChangeDateFrom', '<=', endDate)
    })

    if (employee.shiftChanges.length > 0) {
      if (employee.shiftChanges[0].shiftTo) {
        checkAssist.assist.dateShift = employee.shiftChanges[0].shiftTo
        checkAssist.assist.isRestDay = false

        if (employee.shiftChanges[0].employeeShiftChangeDateToIsRestDay) {
          checkAssist.assist.isRestDay = true
        }

        if (checkAssist.assist.dateShift) {
          checkAssist.assist.dateShift.shiftIsChange = true
        }
      }
    }
    return checkAssist
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
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('UTC').plus({ minutes: 1 })

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
    const timeToEnd = DateTime.fromISO(stringDate, { setZone: true }).setZone('UTC').plus({ minutes: timeToAdd })

    checkAssist.assist.checkOutDateTime = timeToEnd

    return checkAssist
  }

  private async isExceptionDate(employeeID: number | undefined, checkAssist: AssistDayInterface, employee: Employee | null) {
    if (!employeeID) {
      return checkAssist
    }

    if (!employee) {
      return checkAssist
    }

    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssist
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('UTC-6')
    const startDate = `${timeToStart.toFormat('yyyy-LL-dd')} 00:00:00`
    const endDate = `${timeToStart.toFormat('yyyy-LL-dd')} 23:59:59`

    await employee.load('shift_exceptions', (query) => {
      query.where('shiftExceptionsDate', '>=', startDate)
      query.where('shiftExceptionsDate', '<=', endDate)
    })

    checkAssist.assist.hasExceptions = employee.shift_exceptions.length > 0 ? true : false
    checkAssist.assist.exceptions = employee.shift_exceptions as unknown as ShiftExceptionInterface[]

    return checkAssist
  }

  private async calculateRawCalendar(dateAssistItem: AssistDayInterface, assistList: AssistDayInterface[]) {
    const startDay = DateTime.fromJSDate(new Date(`${dateAssistItem.assist.dateShiftApplySince}`)).setZone('UTC-6')
    const evaluatedDay = DateTime.fromISO(`${dateAssistItem.day}T00:00:00.000-06:00`).setZone('UTC-6')
    const checkOutDateTime = DateTime.fromJSDate(new Date(`${dateAssistItem.assist.checkOutDateTime}`)).setZone('UTC-6')

    if (dateAssistItem.assist.assitFlatList) {
      dateAssistItem.assist.assitFlatList = this.fixedCSTSummerTime(evaluatedDay.toJSDate(), dateAssistItem.assist.assitFlatList)
    }

    const checkInDateTime = DateTime.fromJSDate(new Date(`${dateAssistItem.assist.checkInDateTime}`)).setZone('UTC-6')
    const shangeShiftStartDay = dateAssistItem.assist.dateShift?.shiftIsChange ? evaluatedDay : startDay

    const calendarDayStatus = this.calendarDayStatus(dateAssistItem, evaluatedDay, shangeShiftStartDay, dateAssistItem.assist.shiftCalculateFlag)

    let isStartWorkday = calendarDayStatus.isStartWorkday
    let isRestWorkday = calendarDayStatus.isRestWorkday

    if (isRestWorkday !==  dateAssistItem.assist.isRestDay &&  dateAssistItem.assist.dateShift?.shiftIsChange) {
      isRestWorkday = dateAssistItem.assist.isRestDay
    }
    dateAssistItem.assist.isFutureDay = calendarDayStatus.isNextDay

    if (dateAssistItem.assist.exceptions.length > 0) {
      const workRestDay = dateAssistItem.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'descanso-laborado')
      if (workRestDay) {
        isStartWorkday = true
        isRestWorkday = false

        if (dateAssistItem.assist.exceptions.length > 0) {
          dateAssistItem.assist.checkInStatus = ''
        }
      } else {
        const restDay = dateAssistItem.assist.exceptions.find((ex) => ex.exceptionType?.exceptionTypeSlug === 'rest-day')
        if (restDay) {
          isRestWorkday = true
        }
      }

      const coverShiftDay = dateAssistItem.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'cover-shift')

      if (coverShiftDay) {
        isStartWorkday = true
        isRestWorkday = false

        if (dateAssistItem.assist.exceptions.length > 0) {
          dateAssistItem.assist.checkInStatus = ''
        }
      }

      const vacationDay = dateAssistItem.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'vacation')

      if (vacationDay) {
        dateAssistItem.assist.isVacationDate = true

        dateAssistItem.assist.checkInStatus = ''
        dateAssistItem.assist.checkOutStatus = ''

        dateAssistItem.assist.checkIn = null
        dateAssistItem.assist.checkEatIn = null
        dateAssistItem.assist.checkEatOut = null
        dateAssistItem.assist.checkOut = null
      }
    }

    if (isStartWorkday) {
      const checkOutShouldbeNextDay = checkOutDateTime.toFormat('yyyy-LL-dd') > checkInDateTime.toFormat('yyyy-LL-dd')

      if (checkOutShouldbeNextDay) {
        dateAssistItem.assist.checkIn = null
        dateAssistItem.assist.checkEatIn = null
        dateAssistItem.assist.checkEatOut = null
        dateAssistItem.assist.checkOut = null

        if (dateAssistItem.assist.assitFlatList) {
          const calendarDay: AssistInterface[] = []

          /**
           * =================================================================================================================
           * YA QUE EL TURNO CUBRE DOS DIAS, PUEDE SUCEDER QUE EXISTAN CHECKS EN AMBOS DIAS
           * POR LO QUE SOLAMENTE SE OBTIENEN LOS CHECKS QUE PUEDAN CORRESPONDER A
           * TRES HORAS ANTES DE INICIAR EL TURNO, CUIDANDO ASI QUE NO SE TOMEN HORAS DEL
           * TURNO DEL DIA ANTERIOR, COMO HORAS DE COMIDA
           * =================================================================================================================
           */
          const checkInToNexCalendarDay = this.setNexCalendarDayCheckIns(dateAssistItem.assist.assitFlatList, checkInDateTime)
          calendarDay.push(...checkInToNexCalendarDay)

          /**
           * =================================================================================================================
           * AL SER UN TURNO CON MAS DE UN DIA, SE VALIDA SOBRE EL PROXIMO DIA Y SE OBTIENEN LOS CHECKS
           * QUE SE ENCUENTREN HASTA TRES HORAS DESPUES DE LA HORA DE SALIDA ESPERADA, POR SI A CASO SE HA
           * QUEDADO MAS TIEMPO EL EMPLEADO Y YA NO HAGA CONFLICTO CON LAS HORAS DEL PROXIMO TURNO
           * =================================================================================================================
           */
          const checkOutToNexCalendarDay = this.setNexCalendarDayCheckOuts(evaluatedDay, assistList, checkOutDateTime)
          calendarDay.push(...checkOutToNexCalendarDay)

          /**
           * =================================================================================================================
           * COMENZAMOS A FORMAR EL CALENDARIO YA QUE SE HAN DESCARTADO LOS CHECKS QUE NO SON
           * DEL TURNO DEL DIA Y EN EL CALENDARIO YA CONTAMOS CON TODOS LOS CHECKS QUE CORRESPONDEN AL TURNO
           * =================================================================================================================
           */
          if (calendarDay.length > 0) {
            dateAssistItem.assist.checkIn = calendarDay[0]

            if (calendarDay.length >= 2) {
              dateAssistItem.assist.checkEatIn = calendarDay[1]
            }

            if (calendarDay.length >= 3) {
              dateAssistItem.assist.checkEatOut = calendarDay[2]
            }

            const nowDate = DateTime.now().setZone('UTC-6')
            const diffOutNow = nowDate.diff(checkOutDateTime, 'milliseconds').milliseconds

            if (diffOutNow >= 0) {
              if (calendarDay.length >= 2) {
                if (calendarDay.length > 4) {
                  dateAssistItem.assist.checkOut = calendarDay[calendarDay.length - 2]
                } else {
                  dateAssistItem.assist.checkOut = calendarDay[calendarDay.length - 1]
                }

              } else {
                dateAssistItem.assist.checkOut = null
              }


              if (calendarDay.length <= 2) {
                dateAssistItem.assist.checkEatIn = null
              }

              if (calendarDay.length <= 3) {
                dateAssistItem.assist.checkEatOut = null
              }
            }
          }
        }
      } else {
        /**
         * =================================================================================================================
         * FORMAR EL CALENDARIO PARA EL RESTO DE LOS TURNOS QUE NO ABARCAN DOS DIAS
         * =================================================================================================================
         */
        if (dateAssistItem.assist.assitFlatList) {
          const assists = dateAssistItem.assist.assitFlatList.filter(a => a.assistUsed === false)
          if (assists.length > 0) {
            dateAssistItem.assist.checkIn = assists[0]

            if (assists.length >= 2) {
              dateAssistItem.assist.checkEatIn = assists[1]
            }

            if (assists.length >= 3) {
              dateAssistItem.assist.checkEatOut = assists[2]
            }

            const nowDate = DateTime.now().setZone('UTC-6')
            const diffOutNow = nowDate.diff(checkOutDateTime, 'milliseconds').milliseconds

            if (diffOutNow >= 0) {
              dateAssistItem.assist.checkOut = assists.length >= 2 ? assists[assists.length - 1] : null

              if (assists.length <= 2) {
                dateAssistItem.assist.checkEatIn = null
              }

              if (assists.length <= 3) {
                dateAssistItem.assist.checkEatOut = null
              }
            }
          }
        }
      }

      /**
       * =================================================================================================================
       * VALIDAR SI LOS CHECKS CORRESPONDEN AL DIA UNO DEL TURNO O AL DIA DOS
       * =================================================================================================================
       */
      dateAssistItem = this.setCheckOnNextDayFlags(dateAssistItem, checkInDateTime)
    }

    const existeWorkBreak = dateAssistItem.assist.exceptions.some(
      exception => exception.exceptionType?.exceptionTypeSlug === 'descanso-laborado' &&
      exception.shiftExceptionEnjoymentOfSalary &&
      exception.shiftExceptionEnjoymentOfSalary === 1
    )

    if (isRestWorkday) {
      dateAssistItem.assist.isRestDay = true
      dateAssistItem.assist.checkInStatus = ''
      dateAssistItem.assist.checkOutStatus = ''

      if (dateAssistItem.assist.checkIn) {
          if (!existeWorkBreak) {
            dateAssistItem.assist.checkIn = null
            dateAssistItem.assist.checkEatIn = null
            dateAssistItem.assist.checkEatOut = null
            dateAssistItem.assist.checkOut = null
          }
      }
    }

    dateAssistItem.assist.checkOutStatus = ''

    return dateAssistItem
  }

  private checkInStatus(checkAssist: AssistDayInterface, TOLERANCE_FAULT_MINUTES: number, TOLERANCE_DELAY_MINUTES: number, discriminated?: Boolean) {
    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    if (!checkAssist?.assist?.checkIn?.assistPunchTimeUtc) {
      checkAssist.assist.checkInStatus = !checkAssist?.assist?.checkOut ? 'fault' : ''

      if (discriminated) {
        checkAssist.assist.checkInStatus = ''
      }

      if (checkAssist.assist.isHoliday) {
        checkAssist.assist.checkInStatus = ''
      }

      if (checkAssist.assist.exceptions.length > 0) {
        const absentException = checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'absence-from-work')

        if (absentException) {
          checkAssist.assist.checkInStatus = ''
          return checkAssist
        }

        const changeShiftException = checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'change-shift')

        if (changeShiftException) {
          checkAssist.assist.checkInStatus = ''
          return checkAssist
        }
      }

      return checkAssist
    }

    const dayTimeToStart = this.getShiftCheckInTimeToStart(checkAssist.day, checkAssist.assist.dateShift)
    const dayCheckInTime = DateTime.fromISO(checkAssist.assist.checkIn.assistPunchTimeUtc.toString(), { setZone: true }).setZone('UTC-6')
    const diffTime = dayCheckInTime.diff(dayTimeToStart, 'minutes').minutes

    if (diffTime > TOLERANCE_FAULT_MINUTES && !discriminated) {
      if (checkAssist.assist) {
        checkAssist.assist.checkInStatus = 'fault'
      }

      if (checkAssist.assist.exceptions.length > 0) {
        const vacationException = checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'vacation')

        if (vacationException) {
          checkAssist.assist.checkInStatus = ''
        }
      }

      return checkAssist
    }
    if (diffTime > TOLERANCE_DELAY_MINUTES) {
      checkAssist.assist.checkInStatus = 'delay'
    }

    if (diffTime <= TOLERANCE_DELAY_MINUTES) {
      checkAssist.assist.checkInStatus = 'tolerance'
    }

    if (diffTime <= 0) {
      checkAssist.assist.checkInStatus = 'ontime'
    }

    if (discriminated) {
      checkAssist.assist.checkInStatus = ''
    }
    return checkAssist
  }

  private checkOutStatus(checkAssist: AssistDayInterface, discriminated?: Boolean) {
    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    const hourStart = checkAssist.assist.dateShift.shiftTimeStart
    const dateYear = checkAssist.day.split('-')[0].toString().padStart(2, '0')
    const dateMonth = checkAssist.day.split('-')[1].toString().padStart(2, '0')
    const dateDay = checkAssist.day.split('-')[2].toString().padStart(2, '0')
    const stringDate = `${dateYear}-${dateMonth}-${dateDay}T${hourStart}.000-06:00`
    const timeToAdd = checkAssist.assist.dateShift.shiftActiveHours * 60 - 1
    const timeToEnd = DateTime.fromISO(stringDate, { setZone: true }).setZone('UTC-6').plus({ minutes: timeToAdd })

    const currentNowTime = DateTime.now().setZone('UTC-6')

    if (!checkAssist?.assist?.checkOut?.assistPunchTimeUtc) {
      checkAssist.assist.checkOutStatus = checkAssist.assist.checkInStatus === 'fault' ? 'fault' : ''
      return checkAssist
    }

    const DayTime = DateTime.fromISO(`${checkAssist.assist.checkOut.assistPunchTimeUtc}`, { setZone: true })
    const checkTime = DayTime.setZone('UTC-6')
    const checkTimeDateYear = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
    const checkTimeStringDate = `${checkTime.toFormat('yyyy-LL-dd')}T${checkTimeDateYear}.000-06:00`
    const timeToCheckOut = DateTime.fromISO(checkTimeStringDate, { setZone: true }).setZone('UTC-6')
    const diffTime = timeToEnd.diff(timeToCheckOut, 'minutes').minutes
    const diffTimeNow = currentNowTime.diff(timeToEnd, 'minutes').minutes

    if (diffTime > 0 && diffTimeNow > 0) {
      if (checkAssist.assist.assitFlatList?.length === 3) {
        checkAssist.assist.checkEatOut = null
      }

      if (checkAssist.assist.assitFlatList?.length === 2) {
        checkAssist.assist.checkEatIn = null
      }
    }

    if (diffTime > 10 && (currentNowTime > timeToEnd)) {
      checkAssist.assist.checkOutStatus = 'delay'
    }

    if (diffTime <= 10) {
      checkAssist.assist.checkOutStatus = 'tolerance'
    }

    if (diffTime <= 0) {
      checkAssist.assist.checkOutStatus = 'ontime'
    }

    if (discriminated) {
      checkAssist.assist.checkOutStatus = ''
      return checkAssist
    }

    return checkAssist
  }

  private setNexCalendarDayCheckIns (assitFlatList: AssistInterface[], checkInDateTime: DateTime): AssistInterface[] {
    const calendarDay: AssistInterface[] = []
    assitFlatList.forEach((checkItem) => {
      const punchTime = DateTime.fromISO(`${checkItem.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6')

      const diffToCheckStart = punchTime.diff(checkInDateTime.minus({ hours: 3 }), 'milliseconds').milliseconds

      if (diffToCheckStart > 0) {
        checkItem.assistPunchTime = punchTime.setZone('UTC')
        checkItem.assistPunchTimeUtc = punchTime.setZone('UTC')
        checkItem.assistPunchTimeOrigin = punchTime.setZone('UTC')
        calendarDay.push(checkItem)
      }
    })

    return calendarDay
  }

  private setNexCalendarDayCheckOuts (evaluatedDay: DateTime, assistList: AssistDayInterface[], checkOutDateTime: DateTime): AssistInterface[] {
    const calendarDay: AssistInterface[] = []
    const nextEvaluatedDay = evaluatedDay.plus({ days: 1 }).toFormat('yyyy-LL-dd')
    const nextDay = assistList.find((assistDate) => assistDate.day === nextEvaluatedDay)

    if (nextDay && nextDay?.assist?.assitFlatList) {
      const evaluatedSummerNextDay = new Date(nextDay?.day)
      const nexDayCheckList: AssistInterface[] = JSON.parse(JSON.stringify(nextDay.assist.assitFlatList))
      const fixedNexDayCheckList = this.fixedCSTSummerTime(evaluatedSummerNextDay, nexDayCheckList)
      fixedNexDayCheckList.forEach((checkItem) => {
        const punchTime = DateTime.fromISO(`${checkItem.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6')
        const diffToCheckOut = punchTime.diff(checkOutDateTime.plus({ hours: 3 }), 'milliseconds').milliseconds

        if (diffToCheckOut <= 0) {
          checkItem.assistPunchTime = punchTime.setZone('UTC')
          checkItem.assistPunchTimeUtc = punchTime.setZone('UTC')
          checkItem.assistPunchTimeOrigin = punchTime.setZone('UTC')
          calendarDay.push(checkItem)
        }
      })
    }

    return calendarDay
  }

  private setCheckOnNextDayFlags (dateAssistItem: AssistDayInterface, checkInDateTime: DateTime): AssistDayInterface {
    if (dateAssistItem.assist.checkOut) {
      const punchTimeOut = DateTime.fromISO(`${dateAssistItem.assist.checkOut.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6')
      if (punchTimeOut.toFormat('yyyy-LL-dd') > checkInDateTime.toFormat('yyyy-LL-dd')) {
        dateAssistItem.assist.isCheckOutNextDay = true
      }
    }

    if (dateAssistItem.assist.checkEatIn) {
      const punchTimeOut = DateTime.fromISO(`${dateAssistItem.assist.checkEatIn.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6')
      if (punchTimeOut.toFormat('yyyy-LL-dd') > checkInDateTime.toFormat('yyyy-LL-dd')) {
        dateAssistItem.assist.isCheckInEatNextDay = true
      }
    }

    if (dateAssistItem.assist.checkEatOut) {
      const punchTimeOut = DateTime.fromISO(`${dateAssistItem.assist.checkEatOut.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6')
      if (punchTimeOut.toFormat('yyyy-LL-dd') > checkInDateTime.toFormat('yyyy-LL-dd')) {
        dateAssistItem.assist.isCheckOutEatNextDay = true
      }
    }

    return dateAssistItem
  }

  private getShiftCheckInTimeToStart (day: string, dateShift: ShiftInterface) {
    const hourStart = dateShift.shiftTimeStart
    const stringDate = `${day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('UTC-6').plus({ minutes: 1 })
    return timeToStart
  }

  private async getTolerances() {
    try {
      const systemSettingService = new SystemSettingService()
      const systemSettingActive = (await systemSettingService.getActive()) as unknown as SystemSetting
      let data = [] as Tolerance[]

      if (systemSettingActive) {
         data = await new ToleranceService().index(systemSettingActive.systemSettingId)


      }

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
    if (!checkAssist?.assist?.dateShift) {
      return false
    }

    const now = DateTime.now().setZone('UTC-6')
    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return false
    }

    const hourStart = assignedShift.shiftTimeStart
    const stringDate = `${checkAssist.day}T${hourStart}.000-06:00`
    const timeToStart = DateTime.fromISO(stringDate, { setZone: true }).setZone('UTC-6')
    const diff = now.diff(timeToStart, 'seconds').seconds

    checkAssist.assist.isFutureDay = diff < 0

    return diff < 0
  }

  private isSundayBonus(checkAssist: AssistDayInterface) {
    const currentDate = DateTime.fromISO(`${checkAssist.day}T00:00:00.000-06:00`, { setZone: true }).setZone('UTC-6')
    const naturalDay = currentDate.toFormat('c')
    checkAssist.assist.isSundayBonus = Number.parseInt(`${naturalDay}`) === 7 && ( !!checkAssist?.assist?.checkIn || !!checkAssist?.assist?.checkOut )

    if (!checkAssist.assist.isSundayBonus && checkAssist?.assist?.assitFlatList) {
      checkAssist.assist.assitFlatList.forEach(assistFlat => {
        const checkOutDate = DateTime.fromISO(`${assistFlat.assistPunchTimeUtc}`, { setZone: true }).setZone('UTC-6')
        const checkOutNaturalDay = checkOutDate.toFormat('c')
        checkAssist.assist.isSundayBonus = Number.parseInt(`${checkOutNaturalDay}`) === 7
      })
    }

    return checkAssist
  }

  private isRestDay(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.dateShift) {
      return false
    }

    const currentDate = DateTime.fromISO(`${checkAssist.day}T${checkAssist.assist.dateShift.shiftTimeStart}.000-06:00`, { setZone: true }).setZone('UTC-6')
    const naturalDay = currentDate.toFormat('c')
    const restDay = checkAssist.assist.dateShift.shiftRestDays
      .split(',')
      .find((assistRestDay) => Number.parseInt(`${assistRestDay}`) === Number.parseInt(`${naturalDay}`))

    return !!restDay
  }

  private hasSomeException(employeeID: number | undefined, checkAssist: AssistDayInterface, employee: Employee | null) {
    if (!employeeID) {
      return checkAssist
    }

    if (!employee) {
      return checkAssist
    }

    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssist
    }

    if (checkAssist.assist.exceptions.length > 0) {
      const restException = checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'rest-day')
      const exWrongSystem = !!checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'error-de-horario-en-sistema')
      const exNewWorker = !!checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'nuevo-ingreso')
      const exIncapacity = !!checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'falta-por-incapacidad')
      const exMaternity = !!checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'incapacidad-por-maternidad')
      const exAbsentWork = !!checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'absence-from-work')

      if (exWrongSystem || exNewWorker || exIncapacity || exMaternity || exAbsentWork) {
        checkAssist.assist.checkInStatus = 'exception'
        checkAssist.assist.checkOutStatus = 'exception'
      }

      const exAbsentWorkWithOutSalary = checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary === 0 && ex.exceptionType?.exceptionTypeSlug === 'absence-from-work')

      if (exAbsentWorkWithOutSalary) {
        checkAssist.assist.checkInStatus = 'fault'
        checkAssist.assist.checkIn = null
        checkAssist.assist.checkEatIn = null
        checkAssist.assist.checkOut = null
        checkAssist.assist.checkEatOut = null
      }

      if (restException) {
        checkAssist.assist.isRestDay = true
      }
    }

    return checkAssist
  }

  private isVacationDate(employeeID: number | undefined, checkAssist: AssistDayInterface, employee: Employee | null) {
    if (!employeeID) {
      return checkAssist
    }

    if (!employee) {
      return checkAssist
    }

    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssist
    }

    if (checkAssist.assist.exceptions.length > 0) {
      const absentException = checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'vacation')

      if (absentException) {
        checkAssist.assist.isVacationDate = true

        if (!checkAssist.assist.checkIn) {
          checkAssist.assist.checkInStatus = ''
          checkAssist.assist.checkOutStatus = ''
        }
      }
    }

    return checkAssist
  }

  private isWorkDisabilityDate(employeeID: number | undefined, checkAssist: AssistDayInterface, employee: Employee | null) {
    if (!employeeID) {
      return checkAssist
    }

    if (!employee) {
      return checkAssist
    }

    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }

    const assignedShift = checkAssist.assist.dateShift

    if (!assignedShift) {
      return checkAssist
    }

    if (checkAssist.assist.exceptions.length > 0) {
      const absentException = checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionEnjoymentOfSalary !== 0 && ex.exceptionType?.exceptionTypeSlug === 'falta-por-incapacidad')

      if (absentException) {
        checkAssist.assist.isWorkDisabilityDate = true

        if (!checkAssist.assist.checkIn) {
          checkAssist.assist.checkInStatus = ''
          checkAssist.assist.checkOutStatus = ''
        }
      }
    }

    return checkAssist
  }

  private getCheckInDate(dayAssist: AssistInterface[]) {
    const assists = dayAssist.filter(a => a.assistUsed === false)
    const assist = assists.length > 0 ? assists[0] : null
    return assist
  }

  private getCheckEatInDate(dayAssist: AssistInterface[]) {
    let assist = null
    const assists = dayAssist.filter(a => a.assistUsed === false)
    if (assists.length > 2) {
      assist = assists[1]
    }

    return assist
  }

  private getCheckEatOutDate(dayAssist: AssistInterface[]) {
    let assist = null
    const assists = dayAssist.filter(a => a.assistUsed === false)
    if (assists.length > 3) {
      assist = assists[2]
    }

    return assist
  }

  private getCheckOutDate(dayAssist: AssistInterface[]) {
    let assist = null
    const assists = dayAssist.filter(a => a.assistUsed === false)
    if (assists.length > 1) {
      assist = assists[assists.length - 1]
    }

    return assist
  }

  private getMexicoDSTChangeDates (year: number) {
    const startDST = new Date(year, 3, 1)
    startDST.setDate(1 + (7 - startDST.getDay()) % 7) // Asegura que es el primer domingo

    // Último domingo de octubre (fin del horario de verano)
    const endDST = new Date(year, 9, 31)
    endDST.setDate(endDST.getDate() - endDST.getDay()) // Asegura que es el último domingo

    return { startDST, endDST }
  }

  private checkDSTSummerTime (date: Date): boolean {
    const year = date.getFullYear()
    const { startDST, endDST } = this.getMexicoDSTChangeDates(year)

    if (date >= startDST && date < endDST) {
      // En horario de verano
      return true
    } else {
      // En horario estándar
      return false
    }
  }

  private fixedCSTSummerTime (evaluatedDay: Date, assitFlatList: AssistInterface[]) {
    const isSummerTime = this.checkDSTSummerTime(evaluatedDay)
    const fixedList = assitFlatList.map((checkItem: any) => {
      if (isSummerTime) {
        checkItem.assistPunchTimeUtc = DateTime.fromISO(checkItem.assistPunchTimeUtc.toString()).setZone('UTC').plus({ hour: 1 })
        checkItem.assistPunchTime = DateTime.fromISO(checkItem.assistPunchTime.toString()).setZone('UTC').plus({ hour: 1 })
        checkItem.assistPunchTimeOrigin = DateTime.fromISO(checkItem.assistPunchTimeUtc.toString()).setZone('UTC').plus({ hour: 1 })
      }
      return checkItem
    })

    return fixedList
  }

  private calendarDayStatus (dateAssistItem: AssistDayInterface, evaluatedDay: DateTime, startDay: DateTime, flag: string) {
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

  private hasSomeExceptionTimeCheckIn(checkAssist: AssistDayInterface, TOLERANCE_DELAY_MINUTES: number) {
    if (!checkAssist) {
      return checkAssist
    }

    if (checkAssist.assist.dateShift) {
      if (checkAssist.assist.exceptions.length > 0) {
        const exception = checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionCheckInTime)

        if (exception) {
          const dateYear = checkAssist.day.split('-')[0].toString().padStart(2, '0')
          const dateMonth = checkAssist.day.split('-')[1].toString().padStart(2, '0')
          const dateDay = checkAssist.day.split('-')[2].toString().padStart(2, '0')
          const DayTime = DateTime.fromISO(`${checkAssist.assist.checkIn?.assistPunchTimeUtc}`, { setZone: true })
          const checkTime = DayTime.setZone('UTC-6')
          const checkTimeTime = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
          const stringInDateString = `${dateYear}-${dateMonth}-${dateDay}T${checkTimeTime.padStart(8, '0')}.000-06:00`
          const timeCheckIn = DateTime.fromISO(stringInDateString, { setZone: true }).setZone('UTC-6')

          if (exception.shiftExceptionCheckInTime) {
            const shiftExceptionCheckInTime = DateTime.fromFormat(exception.shiftExceptionCheckInTime, 'HH:mm:ss')
            const diffTime = timeCheckIn.diff(timeCheckIn.set({ hour: shiftExceptionCheckInTime.hour, minute: shiftExceptionCheckInTime.minute }), 'minutes').as('minutes')

            if (diffTime > TOLERANCE_DELAY_MINUTES) {
              checkAssist.assist.checkInStatus = 'delay'
            }

            if (diffTime <= TOLERANCE_DELAY_MINUTES) {
              checkAssist.assist.checkInStatus = 'tolerance'
            }

            if (diffTime <= 0) {
              checkAssist.assist.checkInStatus = 'ontime'
            }
          }
        }
      }
    }

    return checkAssist
  }

  private validTime(checkAssist: AssistDayInterface) {
    if (!checkAssist) {
      return checkAssist
    }

    if (checkAssist.assist.checkIn?.assistId === checkAssist.assist.checkOut?.assistId ) {
      checkAssist.assist.checkOut = null
    }

    return checkAssist
  }

  private async hasSomeExceptionTimeCheckOut(checkAssist: AssistDayInterface) {
    if (!checkAssist) {
      return checkAssist
    }

    if (checkAssist.assist.dateShift) {
      if (checkAssist.assist.exceptions.length > 0) {
        const exception = checkAssist.assist.exceptions.find((ex) => ex.shiftExceptionCheckOutTime)

        if (exception) {
          if (!checkAssist?.assist?.checkOut?.assistPunchTimeUtc) {
            checkAssist.assist.checkOutStatus = checkAssist.assist.checkInStatus === 'fault' ? 'fault' : ''
            return checkAssist
          }

          const DayTime = DateTime.fromISO(`${checkAssist.assist.checkOut.assistPunchTimeUtc}`, { setZone: true })
          const checkTime = DayTime.setZone('UTC-6')
          const checkTimeDateYear = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
          const checkTimeStringDate = `${checkTime.toFormat('yyyy-LL-dd')}T${checkTimeDateYear}.000-06:00`
          const timeToCheckOut = DateTime.fromISO(checkTimeStringDate, { setZone: true }).setZone('UTC-6')

          if (exception.shiftExceptionCheckOutTime) {
            const shiftExceptionCheckOutTime = DateTime.fromFormat(exception.shiftExceptionCheckOutTime, 'HH:mm:ss')
            const diffTime = timeToCheckOut.diff(timeToCheckOut.set({ hour: shiftExceptionCheckOutTime.hour, minute: shiftExceptionCheckOutTime.minute }), 'minutes').as('minutes')

            if (diffTime > 0) {
              checkAssist.assist.checkOutStatus = 'ontime'
            } else if (diffTime >= -10) {
              checkAssist.assist.checkOutStatus = 'tolerance'
            } else if (diffTime < -10) {
              checkAssist.assist.checkOutStatus = 'delay'
            }
          }
        }
      }
    }

    return checkAssist
  }

  verifyCheckOutToday(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.dateShift) {
      return checkAssist
    }
    if (checkAssist.assist.checkInStatus === 'fault') {
      return checkAssist
    }
    const hourStart = checkAssist.assist.dateShift.shiftTimeStart
    const shiftActiveHours = checkAssist.assist.dateShift.shiftActiveHours
    const day = checkAssist.day

    const stringDate = `${day}T${hourStart}`
    const start = DateTime.fromISO(stringDate, { zone: 'UTC-6' })
    const end = start.plus({ hours: shiftActiveHours })

    const now = DateTime.now().setZone('UTC-6')

    if (end < now) {
      if (checkAssist.assist.checkIn && !checkAssist.assist.checkOut) {
        checkAssist.assist.checkInStatus = 'fault'
      }
    }

    return checkAssist
  }

  async syncronizeAssistAllEmployeesCalendar(dateStart: string, dateEnd: string) {
    const businessConf = `${env.get('SYSTEM_BUSINESS')}`
    const businessList = businessConf.split(',')
    const businessUnits = await BusinessUnit.query()
      .where('business_unit_active', 1)
      .whereIn('business_unit_slug', businessList)

    const businessUnitsList = businessUnits.map((business) => business.businessUnitId)
    const departmentService = new DepartmentService()
    const employeeService = new EmployeeService()
    const departments = await Department.query()
      .whereIn('businessUnitId', businessUnitsList)
      .where('departmentId', '<>', 999)
      .orderBy('departmentName', 'asc')
    for await (const department of departments) {
      const departmentId = department.departmentId
      const page = 1
      const limit = 999999999999999
      const resultPositions = await departmentService.getPositions(departmentId, null)
      for await (const position of resultPositions) {
        const resultEmployes = await employeeService.index(
          {
            search: '',
            departmentId: departmentId,
            positionId: position.positionId,
            employeeWorkSchedule: '',
            page: page,
            limit: limit,
            ignoreDiscriminated: 0,
            ignoreExternal: 1,
            onlyPayroll: false,
            userResponsibleId: 0,
          },
          [departmentId]
        )
        const dataEmployes: any = resultEmployes
        for await (const employee of dataEmployes) {
          const filter: SyncAssistsServiceIndexInterface = {
            date: dateStart,
            dateEnd: dateEnd,
            employeeID: employee.employeeId
          }
          await this.setDateCalendar(filter)
        }
      }
    }
  }
}
