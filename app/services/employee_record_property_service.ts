import EmployeeRecordProperty from '#models/employee_record_property'
import { EmployeeRecordPropertyFilterSearchInterface } from '../interfaces/employee_record_property_filter_search_interface.js'

export default class EmployeeRecordPropertyService {
  async index(filters: EmployeeRecordPropertyFilterSearchInterface) {
    const roles = await EmployeeRecordProperty.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(employee_record_property_name) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
        query.orWhereRaw('UPPER(employee_record_property_type) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
      })
      .orderBy('employee_record_property_id')
      .paginate(filters.page, filters.limit)
    return roles
  }
}
