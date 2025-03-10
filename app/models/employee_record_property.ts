import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *     EmployeeRecordProperty:
 *       type: object
 *       properties:
 *         employeeRecordPropertyId:
 *           type: number
 *           description: Employee record property ID
 *         employeeRecordPropertyName:
 *           type: string
 *           nullable: true
 *           description: Employee record property name
 *         employeeRecordPropertyType:
 *           type: string
 *           nullable: true
 *           description: Employee record property type
 *           enum: [Text, File, Currency, Decimal, Number]
 *         employeeRecordPropertyCategoryName:
 *           type: string
 *           nullable: true
 *           description: Employee record property category name
 *         employeeRecordPropertyCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the employee record property was created
 *         employeeRecordPropertyUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the employee record property was last updated
 *         employeeRecordPropertyDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the employee record property was soft-deleted
 *       example:
 *         employeeRecordPropertyId: 1
 *         employeeRecordPropertyName: 'Idioma/Nivel'
 *         employeeRecordPropertyType: 'Text'
 *         employeeRecordPropertyCategoryName: 'Idiomas'
 *         employeeRecordPropertyCreatedAt: '2025-02-12T12:00:00Z'
 *         employeeRecordPropertyUpdatedAt: '2025-02-12T13:00:00Z'
 *         employeeRecordPropertyDeletedAt: null
 */

export default class EmployeeRecordProperty extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare employeeRecordPropertyId: number

  @column()
  declare employeeRecordPropertyName: string

  @column()
  declare employeeRecordPropertyType: string

  @column()
  declare employeeRecordPropertyCategoryName: string

  @column.dateTime({ autoCreate: true })
  declare employeeRecordPropertyCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeRecordPropertyUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_record_property_deleted_at' })
  declare deletedAt: DateTime | null
}
