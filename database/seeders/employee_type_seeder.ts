import EmployeeType from '#models/employee_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const dateTime = DateTime.now()

    await EmployeeType.createMany([
      {
        employeeTypeId: 1,
        employeeTypeName: 'employee',
        employeeTypeSlug: 'employee',
        employeeTypeCreatedAt: dateTime,
        employeeTypeUpdatedAt: dateTime,
      },
      {
        employeeTypeId: 2,
        employeeTypeName: 'pilot',
        employeeTypeSlug: 'pilot',
        employeeTypeCreatedAt: dateTime,
        employeeTypeUpdatedAt: dateTime,
      },
      {
        employeeTypeId: 3,
        employeeTypeName: 'flight attendant',
        employeeTypeSlug: 'flight-attendant',
        employeeTypeCreatedAt: dateTime,
        employeeTypeUpdatedAt: dateTime,
      },
    ])
  }
}
