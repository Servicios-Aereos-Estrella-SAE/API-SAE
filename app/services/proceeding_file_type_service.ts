import ProceedingFileType from '#models/proceeding_file_type'
import { ProceedingFileTypeFilterSearchInterface } from '../interfaces/proceeding_file_type_filter_search_interface.js'

export default class ProceedingFileTypeService {
  async index(filters: ProceedingFileTypeFilterSearchInterface) {
    const proceedingFileTypes = await ProceedingFileType.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(proceeding_file_type_name) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
      })
      .orderBy('proceeding_file_type_id')
      .paginate(filters.page, filters.limit)
    return proceedingFileTypes
  }

  async indexByArea(areaToUse: string) {
    const proceedingFileTypes = await ProceedingFileType.query()
      .if(areaToUse, (query) => {
        query.where('proceeding_file_type_area_to_use', areaToUse)
      })
      .orderBy('proceeding_file_type_id')
    return proceedingFileTypes
  }
}
