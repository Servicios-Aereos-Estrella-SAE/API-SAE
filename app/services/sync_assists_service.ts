import StatusSync from '#models/status_sync'
import { DateTime } from 'luxon'
import axios from 'axios'
import PageSync from '#models/page_sync'
import ResponseApiAssistsDto from '#dtos/response_api_assists_dto'
import PaginationDto from '#dtos/pagination_api_dto'
import Assist from '#models/assist'
import env from '#start/env'
import Employee from '#models/employee'
import { AssistDayInterface } from '../interfaces/assist_day_interface.js'
import { AssistInterface } from '../interfaces/assist_interface.js'

export default class SyncAssistsService {
  async synchronize(startDate: string, page: number = 1, limit: number = 50) {
    const dateParam = new Date(startDate)
    let statusSync = await this.getStatusSync()
    if (!statusSync) {
      page = 1
      let response = await this.fetchExternalData(dateParam, page, limit)
      statusSync = await this.createStatusSync(response.pagination)
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
        await this.handleSyncAssists(statusSync, dateParam, pageSync.pageNumber, limit)
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

  async handleSyncAssists(
    statusSync: StatusSync,
    dateParam: Date,
    page: number = 1,
    limit: number = 50
  ) {
    if (new Date(statusSync.dateRequestSync.toJSDate()) <= dateParam) {
      let response = await this.fetchExternalData(dateParam, page, limit)
      await this.updateLocalData(response)
      await this.updatePageSync(page, 'sync', this.getItemsCountsPage(page, response.pagination))
      await this.updatePagination(response.pagination, statusSync)
    }
  }

  async isPageSynced(pageSyncId: number) {
    const pageSync = await PageSync.query().where('id', pageSyncId).first()
    return pageSync?.pageStatus === 'sync'
  }

  async getAssistsRecords(dateParam: Date, page: number, limit: number) {
    return Assist.query()
      .where('punchTime', '>', dateParam)
      .orderBy('punch_time', 'asc')
      .paginate(page, limit)
  }

  async getStatusSync() {
    return await StatusSync.query().orderBy('date_request_sync', 'desc').first()
  }

  async createStatusSync(pagination: PaginationDto) {
    return await StatusSync.create({
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
    const statusSync = await StatusSync.query().where('id', statusSyncId).first()
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
    limit: number
  ): Promise<ResponseApiAssistsDto> {
    // Aquí harías la petición a la API externa
    let apiUrl = `${env.get('API_BIOMETRICS_HOST')}/transactions-async`
    apiUrl = `${apiUrl}?page=${page || ''}`
    apiUrl = `${apiUrl}&limit=${limit || ''}`
    apiUrl = `${apiUrl}&assistDate=${startDate.toISOString() || ''}`
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
            empCode: item.emp_code,
            terminalSn: item.terminal_sn,
            terminalAlias: item.terminal_alias,
            areaAlias: item.area_alias,
            longitude: item.longitude,
            latitude: item.latitude,
            uploadTime: DateTime.fromISO(item.upload_time.toString()),
            empId: item.emp_id,
            terminalId: item.terminal_id,
            punchTime: DateTime.fromISO(item.punch_time_local.toString()),
            punchTimeUtc: DateTime.fromISO(item.punch_time.toString()),
            punchTimeOrigin: DateTime.fromISO(item.punch_time_origin_real.toString()),
          })
          .save()
      } else {
        const newAssist = new Assist()
        newAssist.empCode = item.emp_code
        newAssist.terminalSn = item.terminal_sn
        newAssist.terminalAlias = item.terminal_alias
        newAssist.areaAlias = item.area_alias
        newAssist.longitude = item.longitude
        newAssist.latitude = item.latitude
        newAssist.uploadTime = DateTime.fromISO(item.upload_time.toString())
        newAssist.empId = item.emp_id
        newAssist.terminalId = item.terminal_id
        newAssist.punchTime = DateTime.fromISO(item.punch_time_local.toString())
        newAssist.punchTimeUtc = DateTime.fromISO(item.punch_time.toString())
        newAssist.punchTimeOrigin = DateTime.fromISO(item.punch_time_origin_real.toString())
        newAssist.assistSyncId = item.id
        await newAssist.save()
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

  async updatePagination(pagination: PaginationDto, statusSync: StatusSync) {
    for (let pageNumber: number = 1; pageNumber <= pagination.totalPages; pageNumber++) {
      let pageSync = await PageSync.query().where('page_number', pageNumber).first()
      const countItems = this.getItemsCountsPage(pageNumber, pagination)
      if (!pageSync) {
        await PageSync.create({
          statusSyncId: statusSync.id,
          pageNumber: pageNumber,
          pageStatus: 'pending',
          itemsCount: countItems,
        })
      } else {
        await PageSync.query()
          .where('page_number', pageNumber)
          .update({
            pageStatus: countItems === pageSync.pageNumber ? 'sync' : 'pending',
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
    return await PageSync.query()
      .where('page_number', '<=', page)
      .andWhere('page_status', 'pending')
      .orderBy('page_number', 'asc')
  }

  async updatePageStatus(page: number) {
    // update pageSync where page_number is equal to page
    await PageSync.query().where('page_number', '<=', page).update({
      page_status: 'sync',
    })
  }

  async index(
    params: { date: string; dateEnd: string; employeeID?: number },
    paginator?: { page: number; limit: number }
  ) {
    const stringDate = `${params.date}T00:00:00.000-06:00`
    const time = DateTime.fromISO(stringDate, { setZone: true })
    const timeCST = time.setZone('America/Mexico_City')
    const filterInitialDate = timeCST.toFormat('yyyy-LL-dd HH:mm:ss')

    const query = Assist.query()
      .where('punch_time_origin', '>=', filterInitialDate)
      .orderBy('punch_time_origin', 'desc')

    if (params.dateEnd && params.date) {
      query.where('punch_time_origin', '>=', filterInitialDate)
      query.where('punch_time_origin', '<=', `${params.dateEnd} 23:59:59`)
    }

    if (params.employeeID) {
      const employee = await Employee.query()
        .where('employee_id', params.employeeID || 0)
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

      query.where('emp_code', employee.employeeCode)
    }

    const assistList = await query.paginate(paginator?.page || 1, paginator?.limit || 50)
    const assistListFlat = assistList.toJSON().data as AssistInterface[]
    const assistDayCollection: AssistDayInterface[] = []

    assistListFlat.forEach((item) => {
      const assist = item as AssistInterface
      const assistDate = DateTime.fromJSDate(new Date(`${assist.punchTimeOrigin}`)).toFormat(
        'yyyy-LL-dd'
      )

      const existDay = assistDayCollection.find((itemAssistDay) => itemAssistDay.day === assistDate)

      if (!existDay) {
        let dayAssist: AssistInterface[] = []
        assistListFlat.forEach((dayItem: AssistInterface, index) => {
          const currentDay = DateTime.fromJSDate(new Date(`${dayItem.punchTimeOrigin}`)).toFormat(
            'yyyy-LL-dd'
          )
          if (currentDay === assistDate) {
            dayAssist.push(assistListFlat[index])
          }
        })

        dayAssist = dayAssist.sort((a: any, b: any) => a.punchTimeOrigin - b.punchTimeOrigin)

        assistDayCollection.push({
          day: assistDate,
          assist: {
            check_in: dayAssist.length > 0 ? dayAssist[0] : null,
            check_out: dayAssist.length > 1 ? dayAssist[1] : null,
          },
        })
      }
    })

    return {
      status: 200,
      type: 'success',
      title: 'Successfully action',
      message: 'Success access data',
      data: {
        // date: DateTime.fromJSDate(new ())
        meta: assistList.toJSON().meta,
        data: assistDayCollection.sort(),
      },
    }
  }
}
