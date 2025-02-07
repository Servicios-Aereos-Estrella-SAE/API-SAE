import Address from '#models/address'
import AddressType from '#models/address_type'

export default class AddressService {
  async create(address: Address) {
    const newAddress = new Address()
    newAddress.addressZipcode = address.addressZipcode
    newAddress.addressCountry = address.addressCountry
    newAddress.addressState = address.addressState
    newAddress.addressTownship = address.addressTownship
    newAddress.addressCity = address.addressCity
    newAddress.addressSettlement = address.addressSettlement
    newAddress.addressSettlementType = address.addressSettlementType
    newAddress.addressStreet = address.addressStreet
    newAddress.addressInternalNumber = address.addressInternalNumber
    newAddress.addressExternalNumber = address.addressExternalNumber
    newAddress.addressBetweenStreet1 = address.addressBetweenStreet1
    newAddress.addressBetweenStreet2 = address.addressBetweenStreet2
    newAddress.addressTypeId = address.addressTypeId
    await newAddress.save()
    return newAddress
  }

  async update(currentAddress: Address, address: Address) {
    currentAddress.addressZipcode = address.addressZipcode
    currentAddress.addressCountry = address.addressCountry
    currentAddress.addressState = address.addressState
    currentAddress.addressTownship = address.addressTownship
    currentAddress.addressCity = address.addressCity
    currentAddress.addressSettlement = address.addressSettlement
    currentAddress.addressSettlementType = address.addressSettlementType
    currentAddress.addressStreet = address.addressStreet
    currentAddress.addressInternalNumber = address.addressInternalNumber
    currentAddress.addressExternalNumber = address.addressExternalNumber
    currentAddress.addressBetweenStreet1 = address.addressBetweenStreet1
    currentAddress.addressBetweenStreet2 = address.addressBetweenStreet2
    currentAddress.addressTypeId = address.addressTypeId
    await currentAddress.save()
    return currentAddress
  }

  async verifyInfoExist(address: Address) {
    if (!address.addressId) {
      const existAddressType = await AddressType.query()
        .whereNull('address_type_deleted_at')
        .where('address_type_id', address.addressTypeId)
        .first()

      if (!existAddressType && address.addressTypeId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The address was not found',
          message: 'The address was not found with the entered ID',
          data: { ...address },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...address },
    }
  }

  async getPlaces(search: string, field: 'countries' | 'states' | 'cities') {
    const fieldMap: { [key in 'countries' | 'states' | 'cities']: string } = {
      countries: 'address_country',
      states: 'address_state',
      cities: 'address_city',
    }
    const column = fieldMap[field]
    if (!column) return []
    const address = await Address.query()
      .distinct(column)
      .orWhereRaw('UPPER(??) LIKE ?', [column, `%${search.toUpperCase()}%`])
      .withTrashed()
      .orderBy(column)

    return address
  }
}
