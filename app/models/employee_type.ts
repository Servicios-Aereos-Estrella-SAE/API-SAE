import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { BaseModel, column } from '@adonisjs/lucid/orm'
/**
 * @swagger
 * components:
 *   schemas:
 *     EmployeeType:
 *       type: object
 *       properties:
 *         employeeTypeId:
 *           type: number
 *           description: Employee type ID
 *         employeeTypeName:
 *           type: string
 *           description: Employee type name
 *         employeeTypeSlug:
 *           type: string
 *           description: Employee type slug
 *         employeeTypeCreatedAt:
 *           type: string
 *           format: date-time
 *         employeeTypeUpdatedAt:
 *           type: string
 *           format: date-time
 *         employeeTypeDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *       example:
 *         employeeTypeId: 1
 *         employeeTypeName: "Employee"
 *         employeeTypeSlug: "employee"
 *         employeeTypeCreatedAt: '2024-12-05T12:00:00Z'
 *         employeeTypeUpdatedAt: '2024-12-05T13:00:00Z'
 *         employeeTypeDeletedAt: null
 */
export default class EmployeeType extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare employeeTypeId: number

  @column()
  declare employeeTypeName: string

  @column()
  declare employeeTypeSlug: string

  @column.dateTime({ autoCreate: true })
  declare employeeTypeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeTypeUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_type_deleted_at' })
  declare deletedAt: DateTime | null
}
