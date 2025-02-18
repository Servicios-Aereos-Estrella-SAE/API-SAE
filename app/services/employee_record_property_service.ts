import EmployeeRecord from '#models/employee_record'
import EmployeeRecordProperty from '#models/employee_record_property'
import { EmployeeRecordPropertyFilterSearchInterface } from '../interfaces/employee_record_property_filter_search_interface.js'
import { EmployeeRecordValueInterface } from '../interfaces/employee_record_value_interface.js'

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
        values: EmployeeRecordValueInterface[]
        employeeRecordPropertyId: number
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
      const numericTypes = ['Number', 'Decimal', 'Currency']
      const employeeRecordProperty = await EmployeeRecordProperty.query()
        .where('employeeRecordPropertyCategoryName', employeeRecordPropertyCategoryName)
        .where('employeeRecordPropertyName', employeeRecordPropertyName)
        .where('employeeRecordPropertyType', employeeRecordPropertyType)
        .first()
      const values = [] as Array<EmployeeRecordValueInterface>
      if (employeeRecordProperty) {
        const employeeRecords = await EmployeeRecord.query()
          .whereNull('employee_record_deleted_at')
          .where('employeeId', employeeId)
          .where('employeeRecordPropertyId', employeeRecordProperty.employeeRecordPropertyId)
          .where('employeeRecordActive', 1)
          .orderBy('employeeRecordPropertyId')
        if (employeeRecords) {
          for await (const employeeRecord of employeeRecords) {
            const newValue = {
              employeeRecordValue: numericTypes.includes(employeeRecordPropertyType)
                ? employeeRecord.employeeRecordValue
                  ? Number.parseFloat(employeeRecord.employeeRecordValue)
                  : 0
                : employeeRecord.employeeRecordValue,
              employeeRecordId: employeeRecord.employeeRecordId,
              files: [],
            }
            values.push(newValue)
          }
        }
        categories[employeeRecordPropertyCategoryName].push({
          name: employeeRecordPropertyName,
          type: employeeRecordPropertyType,
          values: values,
          employeeRecordPropertyId: employeeRecordProperty.employeeRecordPropertyId,
        })
      }
    }
    return categories
  }
}
