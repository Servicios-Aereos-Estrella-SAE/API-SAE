import ProceedingFileTypeProperty from '#models/proceeding_file_type_property'
import ProceedingFileTypePropertyValue from '#models/proceeding_file_type_property_value'
import { ProceedingFileTypePropertyFilterSearchInterface } from '../interfaces/proceeding_file_type_property_filter_search_interface.js'
import { ProceedingFileTypePropertyValueValueInterface } from '../interfaces/proceeding_file_type_property_value_value_interface.js'

export default class ProceedingFileTypePropertyService {
  async index(filters: ProceedingFileTypePropertyFilterSearchInterface) {
    const proceedingFileTypeProperties = await ProceedingFileTypeProperty.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(proeceeding_file_type_property_name) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
        query.orWhereRaw('UPPER(proeceeding_file_type_property_type) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
      })
      .orderBy('proeceeding_file_type_property_id')
      .paginate(filters.page, filters.limit)
    return proceedingFileTypeProperties
  }

  async getCategories(employeeId: number, proceedingFileTypeId: number) {
    const proceedingFileTypePropertyValueCategories = await ProceedingFileTypeProperty.query()
      .select(
        'proceedingFileTypePropertyCategoryName',
        'proceedingFileTypePropertyName',
        'proceedingFileTypePropertyType'
      )
      .where('proceeding_file_type_id', proceedingFileTypeId)
      .orderBy('proceedingFileTypePropertyCategoryName', 'asc')
    const categories: {
      [key: string]: {
        name: string
        type: string
        values: ProceedingFileTypePropertyValueValueInterface[]
        proceedingFileTypePropertyId: number
      }[]
    } = {}

    for (const item of proceedingFileTypePropertyValueCategories) {
      const {
        proceedingFileTypePropertyCategoryName,
        proceedingFileTypePropertyName,
        proceedingFileTypePropertyType,
      } = item

      if (!categories[proceedingFileTypePropertyCategoryName]) {
        categories[proceedingFileTypePropertyCategoryName] = []
      }
      const numericTypes = ['Number', 'Decimal', 'Currency']
      const proceedingFileTypeProperty = await ProceedingFileTypeProperty.query()
        .where('proceedingFileTypePropertyCategoryName', proceedingFileTypePropertyCategoryName)
        .where('proceedingFileTypePropertyName', proceedingFileTypePropertyName)
        .where('proceedingFileTypePropertyType', proceedingFileTypePropertyType)
        .first()
      const values = [] as Array<ProceedingFileTypePropertyValueValueInterface>
      if (proceedingFileTypeProperty) {
        const proceedingFileTypePropertyValues = await ProceedingFileTypePropertyValue.query()
          .whereNull('proceeding_file_type_property_value_deleted_at')
          .where('employeeId', employeeId)
          .where(
            'proceedingFileTypePropertyId',
            proceedingFileTypeProperty.proceedingFileTypePropertyId
          )
          .where('proceedingFileTypePropertyValueActive', 1)
          .orderBy('proceedingFileTypePropertyId')
        if (proceedingFileTypePropertyValues) {
          for await (const proceedingFileTypePropertyValue of proceedingFileTypePropertyValues) {
            const newValue = {
              proceedingFileTypePropertyValueValue: numericTypes.includes(
                proceedingFileTypePropertyType
              )
                ? proceedingFileTypePropertyValue.proceedingFileTypePropertyValueValue
                  ? Number.parseFloat(
                      proceedingFileTypePropertyValue.proceedingFileTypePropertyValueValue
                    )
                  : 0
                : proceedingFileTypePropertyValue.proceedingFileTypePropertyValueValue,
              proceedingFileTypePropertyValueId:
                proceedingFileTypePropertyValue.proceedingFileTypePropertyValueId,
              files: [],
            }
            values.push(newValue)
          }
        }
        categories[proceedingFileTypePropertyCategoryName].push({
          name: proceedingFileTypePropertyName,
          type: proceedingFileTypePropertyType,
          values: values,
          proceedingFileTypePropertyId: proceedingFileTypeProperty.proceedingFileTypePropertyId,
        })
      }
    }
    return categories
  }
}
