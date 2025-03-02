import EmployeeContractType from '#models/employee_contract_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const dateTime = DateTime.now()
    await EmployeeContractType.createMany([
      {
        employeeContractTypeId: 1,
        employeeContractTypeName: 'Permanent',
        employeeContractTypeDescription: 'permanent',
        employeeContractTypeSlug: 'permanent',
        employeeContractTypeCreatedAt: dateTime,
        employeeContractTypeUpdatedAt: dateTime,
      },
      {
        employeeContractTypeId: 2,
        employeeContractTypeName: 'Temporary',
        employeeContractTypeDescription: 'temporary',
        employeeContractTypeSlug: 'temporary',
        employeeContractTypeCreatedAt: dateTime,
        employeeContractTypeUpdatedAt: dateTime,
      },
      {
        employeeContractTypeId: 3,
        employeeContractTypeName: 'Seasonal',
        employeeContractTypeDescription: 'seasonal',
        employeeContractTypeSlug: 'seasonal',
        employeeContractTypeCreatedAt: dateTime,
        employeeContractTypeUpdatedAt: dateTime,
      },
      {
        employeeContractTypeId: 4,
        employeeContractTypeName: 'Intern',
        employeeContractTypeDescription: 'intern',
        employeeContractTypeSlug: 'intern',
        employeeContractTypeCreatedAt: dateTime,
        employeeContractTypeUpdatedAt: dateTime,
      },
      {
        employeeContractTypeId: 5,
        employeeContractTypeName: 'Student',
        employeeContractTypeDescription: 'student',
        employeeContractTypeSlug: 'student',
        employeeContractTypeCreatedAt: dateTime,
        employeeContractTypeUpdatedAt: dateTime,
      },
    ])
  }
}
