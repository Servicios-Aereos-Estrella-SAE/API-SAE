import WorkDisabilityType from '#models/work_disability_type'
import { WorkDisabilityTypeFilterSearchInterface } from '../interfaces/work_disability_type_filter_search_interface.js'

export default class WorkDisabilityTypeService {
  async index(filters: WorkDisabilityTypeFilterSearchInterface) {
    const workDisabilityType = await WorkDisabilityType.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(work_disability_type_name) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
        query.orWhereRaw('UPPER(work_disability_type_slug) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
      })
      .orderBy('work_disability_type_id')
      .paginate(filters.page, filters.limit)
    return workDisabilityType
  }
}
