import EmployeeContractType from '#models/employee_contract_type'
import { EmployeeContractTypeFilterSearchInterface } from '../interfaces/employee_contract_type_filter_search_interface.js'

export default class EmployeeContractTypeService {
  async index(filters: EmployeeContractTypeFilterSearchInterface) {
    const employeeContractTypes = await EmployeeContractType.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(employee_contract_type_name) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
        query.orWhereRaw('UPPER(employee_contract_type_slug) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
      })
      .orderBy('employee_contract_type_id')
      .paginate(filters.page, filters.limit)
    return employeeContractTypes
  }
}
