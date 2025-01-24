import InsuranceCoverageType from '#models/insurance_coverage_type'
import { InsuranceCoverageTypeFilterSearchInterface } from '../interfaces/insurance_coverage_type_filter_search_interface.js'

export default class InsuranceCoverageTypeService {
  async index(filters: InsuranceCoverageTypeFilterSearchInterface) {
    const insuranceCoverageTypes = await InsuranceCoverageType.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(insurance_coverage_type_name) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
        query.orWhereRaw('UPPER(insurance_coverage_type_slug) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
      })
      .orderBy('insurance_coverage_type_id')
      .paginate(filters.page, filters.limit)
    return insuranceCoverageTypes
  }
}
