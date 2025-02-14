import EmployeeRecord from '#models/employee_record'
import EmployeeRecordProperty from '#models/employee_record_property'
import { EmployeeRecordPropertyFilterSearchInterface } from '../interfaces/employee_record_property_filter_search_interface.js'

export default class EmployeeRecordPropertyService {
  async index(filters: EmployeeRecordPropertyFilterSearchInterface) {
    const employeeRecordProperties = await EmployeeRecordProperty.query()
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
    return employeeRecordProperties
  }

  async getCategories(employeeId: number) {
    const employeeRecordCategories = await EmployeeRecordProperty.query()
      .select(
        'employeeRecordPropertyCategoryName',
        'employeeRecordPropertyName',
        'employeeRecordPropertyType'
      )
      .orderBy('employeeRecordPropertyCategoryName', 'asc')
    const categories: {
      [key: string]: {
        name: string
        type: string
        value: string
        employeeRecordPropertyId: number
        employeeRecordId: number | null
        files: []
      }[]
    } = {}

    for (const item of employeeRecordCategories) {
      const {
        employeeRecordPropertyCategoryName,
        employeeRecordPropertyName,
        employeeRecordPropertyType,
      } = item

      if (!categories[employeeRecordPropertyCategoryName]) {
        categories[employeeRecordPropertyCategoryName] = []
      }

      const employeeRecordProperty = await EmployeeRecordProperty.query()
        .where('employeeRecordPropertyCategoryName', employeeRecordPropertyCategoryName)
        .where('employeeRecordPropertyName', employeeRecordPropertyName)
        .where('employeeRecordPropertyType', employeeRecordPropertyType)
        .first()
      let value = ''
      let employeeRecordId = null
      if (employeeRecordProperty) {
        const employeeRecord = await EmployeeRecord.query()
          .whereNull('employee_record_deleted_at')
          .where('employeeId', employeeId)
          .where('employeeRecordPropertyId', employeeRecordProperty.employeeRecordPropertyId)
          .first()
        if (employeeRecord) {
          value = employeeRecord.employeeRecordValue
          employeeRecordId = employeeRecord.employeeRecordId
        }
        categories[employeeRecordPropertyCategoryName].push({
          name: employeeRecordPropertyName,
          type: employeeRecordPropertyType,
          value: value,
          employeeRecordPropertyId: employeeRecordProperty.employeeRecordPropertyId,
          employeeRecordId: employeeRecordId,
          files: [],
        })
      }
    }
    return categories
  }
}
