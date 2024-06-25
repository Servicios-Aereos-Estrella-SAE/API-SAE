import StatusSync from '#models/status_sync'
import { DateTime } from 'luxon'
import axios from 'axios'
import PageSync from '#models/page_sync'
import ResponseApiAssistsDto from '#dtos/response_api_assists_dto'
import PaginationDto from '#dtos/pagination_api_dto'
import Assist from '#models/assist'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

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

  async handleSyncAssists(
    statusSync: StatusSync,
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
    logger.info(`Fetching data from external API for date ${startDate.toISOString()}`)
    // Aquí harías la petición a la API externa
    let apiUrl = `${env.get('API_BIOMETRICS_HOST')}/api/v1/transactions-async`
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
            punchTimeOrigin: DateTime.fromISO(item.punch_time_origin.toString()),
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
        newAssist.punchTimeOrigin = DateTime.fromISO(item.punch_time_origin.toString())
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
      return await await PageSync.query().where('page_number', page)
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
}
