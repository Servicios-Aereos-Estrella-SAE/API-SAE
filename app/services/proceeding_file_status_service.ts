import ProceedingFileStatus from '#models/proceeding_file_status'
import { ProceedingFileStatusFilterSearchInterface } from '../interfaces/proceeding_file_status_filter_search_interface.js'

export default class ProceedingFileStatusService {
  async index(filters: ProceedingFileStatusFilterSearchInterface) {
    const proceedingFileStatus = await ProceedingFileStatus.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(proceeding_file_status_name) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
      })
      .paginate(filters.page, filters.limit)
    return proceedingFileStatus
  }
}
