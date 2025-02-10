import Address from '#models/address'
import Employee from '#models/employee'
import EmployeeAddress from '#models/employee_address'

export default class EmployeeAddressService {
  async create(employeeAddress: EmployeeAddress) {
    const newEmployeeAddress = new EmployeeAddress()
    newEmployeeAddress.employeeId = employeeAddress.employeeId
    newEmployeeAddress.addressId = employeeAddress.addressId
    await newEmployeeAddress.save()
    await newEmployeeAddress.load('address')
    return newEmployeeAddress
  }

  async update(currentEmployeeAddress: EmployeeAddress, employeeAddress: EmployeeAddress) {
    currentEmployeeAddress.employeeId = employeeAddress.employeeId
    currentEmployeeAddress.addressId = employeeAddress.addressId
    await currentEmployeeAddress.save()
    return currentEmployeeAddress
  }

  async delete(currentEmployeeAddress: EmployeeAddress) {
    await currentEmployeeAddress.delete()
    return currentEmployeeAddress
  }

  async show(employeeAddressId: number) {
    const employeeAddress = await EmployeeAddress.query()
      .whereNull('employee_address_deleted_at')
      .where('employee_address_id', employeeAddressId)
      .preload('address', async (query) => {
        query.preload('addressType')
      })
      .first()
    return employeeAddress ? employeeAddress : null
  }

  async index() {
    const employeeAddress = await EmployeeAddress.query()
      .whereNull('employee_address_deleted_at')
      .first()
    return employeeAddress ? employeeAddress : null
  }

  async verifyInfoExist(employeeAddress: EmployeeAddress) {
    const existEmployee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeAddress.employeeId)
      .first()

    if (!existEmployee && employeeAddress.employeeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee was not found',
        message: 'The employee was not found with the entered ID',
        data: { ...employeeAddress },
      }
    }

    const existAddress = await Address.query()
      .whereNull('address_deleted_at')
      .where('address_id', employeeAddress.addressId)
      .first()

    if (!existAddress && employeeAddress.addressId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The address was not found',
        message: 'The address was not found with the entered ID',
        data: { ...employeeAddress },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...employeeAddress },
    }
  }
}
