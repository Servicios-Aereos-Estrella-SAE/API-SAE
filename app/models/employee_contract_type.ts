import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *      EmployeeContractType:
 *        type: object
 *        properties:
 *          employeeContractTypeId:
 *            type: number
 *            description: Employee contract type ID
 *          employeeContractTypeName:
 *            type: string
 *            description: Employee contract type name
 *          employeeContractTypeDescription:
 *            type: string
 *            description: Employee contract type description
 *          employeeContractTypeSlug:
 *            type: string
 *            description: Employee contract type SLUG
 *          employeeContractTypeCreatedAt:
 *            type: string
 *            format: date-time
 *          employeeContractTypeUpdatedAt:
 *            type: string
 *            format: date-time
 *          employeeContractTypeDeletedAt:
 *            type: string
 *            format: date-time
 *            nullable: true
 */
export default class EmployeeContractType extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare employeeContractTypeId: number

  @column()
  declare employeeContractTypeName: string

  @column()
  declare employeeContractTypeDescription: string

  @column()
  declare employeeContractTypeSlug: string

  @column.dateTime({ autoCreate: true })
  declare employeeContractTypeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeContractTypeUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_contract_type_deleted_at' })
  declare deletedAt: DateTime | null
}
