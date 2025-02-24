import { AddressTypeFilterSearchInterface } from '../interfaces/address_type_filter_search_interface.js'
import AddressType from '#models/address_type'

export default class AddressTypeService {
  async index(filters: AddressTypeFilterSearchInterface) {
    const addressTypes = await AddressType.query()
      .whereNull('address_type_deleted_at')
      .if(filters.search, (query) => {
        query.andWhere((searchQuery) => {
          searchQuery.whereRaw('UPPER(address_type_name) LIKE ?', [
            `%${filters.search.toUpperCase()}%`,
          ])
        })
      })
      .orderBy('address_type_id')
      .paginate(filters.page, filters.limit)
    return addressTypes
  }
}
