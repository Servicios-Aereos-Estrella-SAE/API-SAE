import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Employee from './employee.js'
import ExceptionType from './exception_type.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import VacationSetting from './vacation_setting.js'
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
 *           format: date
 *           description: Date of the shift exception
 *         shiftExceptionDescription:
 *           type: string
 *           description: Description of the shift exception
 *         vacationSettingId:
 *           type: number
 *           nullable: true
 *           description: ID of the vacation setting associated with the shift exception
 *         shiftExceptionCheckInTime:
 *           type: string
 *           format: time
 *           description: Time check in
 *           nullable: true
 *         shiftExceptionCheckOutTime:
 *           type: string
 *           format: time
 *           description: Time check out
 *           nullable: true
 *         exceptionTypeNeedEnjoymentOfSalary:
 *           type: string
 *           format: time
 *           description: Enjoyment of salary
 *           nullable: true
 *         exceptionTypeNeedPeriodInDays:
 *           type: string
 *           format: time
 *           description: Period in days
 *           nullable: true
 *         exceptionTypeNeedPeriodInHours:
 *           type: string
 *           format: time
 *           description: Period in hours
 *           nullable: true
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
 *         vacationSettingId: 1
 *         shiftExceptionsDate: '2024-06-20'
 *         shiftExceptionsDescription: "Employee was absent from work"
 *         shiftExceptionCheckInTime: '07:00:00'
 *         shiftExceptionCheckOutTime: '21:00:00'
 *         exceptionTypeNeedEnjoymentOfSalary: 'NO'
 *         exceptionTypeNeedPeriodInDays: 0
 *         exceptionTypeNeedPeriodInHours: 0
 *         shiftExceptionCreatedAt: '2024-06-20T12:00:00Z'
 *         shiftExceptionUpdatedAt: '2024-06-20T13:00:00Z'
 *         shiftExceptionDeletedAt: null
 *         daysToApply: 0
 *         employee:
 *           # Example Employee object
 *         exceptionType:
 *           # Example ExceptionType object
 *         vacattionSetting:
 *           # Example ExceptionType object
 */
export default class ShiftException extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare shiftExceptionId: number

  @column()
  declare employeeId: number

  @column()
  declare exceptionTypeId: number

  @column()
  declare shiftExceptionsDate: Date | string

  @column()
  declare shiftExceptionsDescription: string

  @column()
  declare shiftExceptionCheckInTime: string | null

  @column()
  declare shiftExceptionCheckOutTime: string | null

  @column()
  declare exceptionTypeNeedEnjoymentOfSalary: string | null

  @column()
  declare exceptionTypeNeedPeriodInDays: number | null

  @column()
  declare exceptionTypeNeedPeriodInHours: number | null

  @column.dateTime({ autoCreate: true })
  declare shiftExceptionsCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare shiftExceptionsUpdatedAt: DateTime

  @column()
  declare vacationSettingId: number | null

  @column.dateTime({ columnName: 'shift_exceptions_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Employee, {
    foreignKey: 'employeeId',
  })
  declare employee: BelongsTo<typeof Employee>

  @belongsTo(() => ExceptionType, {
    foreignKey: 'exceptionTypeId',
  })
  declare exceptionType: BelongsTo<typeof ExceptionType>

  @belongsTo(() => VacationSetting, {
    foreignKey: 'vacationSettingId',
  })
  declare vacationSetting: BelongsTo<typeof VacationSetting>
}
