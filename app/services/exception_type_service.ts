import ExceptionType from '#models/exception_type'
import { ExceptionTypeFilterSearchInterface } from '../interfaces/exception_type_filter_search_interface.js'

export default class ExceptionTypeService {
  async index(filters: ExceptionTypeFilterSearchInterface) {
    const roles = await ExceptionType.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(exception_type_type_name) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
      })
      .orderBy('exception_type_id')
      .paginate(filters.page, filters.limit)
    return roles
  }
}
