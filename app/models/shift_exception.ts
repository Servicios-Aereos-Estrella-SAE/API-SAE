import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Employee from './employee.js'
import ExceptionType from './exception_type.js'
/**
 * @swagger
 * components:
 *   schemas:
 *     ShiftException:
 *       type: object
 *       properties:
 *         shiftExceptionId:
 *           type: number
 *           description: Shift exception ID
 *         employeeId:
 *           type: number
 *           nullable: false
 *           description: ID of the employee associated with the shift exception
 *         exceptionTypeId:
 *           type: number
 *           nullable: false
 *           description: ID of the exception type associated with the shift exception
 *         shiftExceptionDate:
 *           type: string
 *           format: date-time
 *           description: Date of the shift exception
 *         shiftExceptionDescription:
 *           type: string
 *           description: Description of the shift exception
 *         shiftExceptionCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the shift exception was created
 *         shiftExceptionUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the shift exception was last updated
 *         shiftExceptionDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the shift exception was soft-deleted
 *         employee:
 *           $ref: '#/components/schemas/Employee'
 *           description: Employee associated with this shift exception
 *         exceptionType:
 *           $ref: '#/components/schemas/ExceptionType'
 *           description: Exception type associated with this shift exception
 *       example:
 *         shiftExceptionId: 1
 *         employeeId: 1
 *         exceptionTypeId: 1
 *         shiftExceptionDate: '2024-06-20'
 *         shiftExceptionDescription: "Employee was absent from work"
 *         shiftExceptionCreatedAt: '2024-06-20T12:00:00Z'
 *         shiftExceptionUpdatedAt: '2024-06-20T13:00:00Z'
 *         shiftExceptionDeletedAt: null
 *         employee:
 *           # Example Employee object
 *         exceptionType:
 *           # Example ExceptionType object
 */
export default class ShiftException extends BaseModel {
  @column({ isPrimary: true })
  declare shiftExceptionId: number

  @column()
  declare employeeId: number

  @column()
  declare exceptionTypeId: number

  @column()
  declare shiftExceptionDate: DateTime

  @column()
  declare shiftExceptionDescription: string

  @column.dateTime({ autoCreate: true })
  declare shiftExceptionCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare shiftExceptionUpdatedAt: DateTime

  @column.dateTime()
  declare shiftExceptionDeletedAt: DateTime

  @belongsTo(() => Employee)
  declare employee: relations.BelongsTo<typeof Employee>

  @belongsTo(() => ExceptionType)
  declare exceptionType: relations.BelongsTo<typeof ExceptionType>
}
