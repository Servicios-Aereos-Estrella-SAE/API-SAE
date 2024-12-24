import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ShiftException from './shift_exception.js'
import * as relations from '@adonisjs/lucid/types/relations'
/**
 * @swagger
 * components:
 *   schemas:
 *     ExceptionType:
 *       type: object
 *       properties:
 *         exceptionTypeId:
 *           type: number
 *           description: Exception type ID
 *         exceptionTypeTypeName:
 *           type: string
 *           description: Name of the exception type
 *         exceptionTypeIcon:
 *           type: string
 *           description: Icon representing the exception type
 *         exceptionTypeSlug:
 *           type: string
 *           description: Slug identifier for the exception type
 *         exceptionTypeNeedCheckInTime:
 *           type: number
 *           description: Need check in time
 *           nullable: true
 *         exceptionTypeNeedCheckOutTime:
 *           type: number
 *           description: Need check out time
 *           nullable: true
 *         exceptionTypeNeedReason:
 *           type: number
 *           description: Need reason
 *           nullable: true
 *         exceptionTypeNeedEnjoymentOfSalary:
 *           type: number
 *           description: Need enjoyment of salary
 *           nullable: true
 *         exceptionTypeNeedPeriodInDays:
 *           type: number
 *           description: Need period in days
 *           nullable: true
 *         exceptionTypeNeedPeriodInHours:
 *           type: number
 *           description: Need period in hours
 *           nullable: true
 *         exceptionTypeCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the exception type was created
 *         exceptionTypeUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the exception type was last updated
 *         exceptionTypeDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the exception type was soft-deleted
 *         shiftExceptions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ShiftException'
 *           description: List of shift exceptions associated with this exception type
 *       example:
 *         exceptionTypeId: 1
 *         exceptionTypeTypeName: "Absence from work"
 *         exceptionTypeIcon: "icon_absence_from_work"
 *         exceptionTypeSlug: "absence-from-work"
 *         exceptionTypeCreatedAt: '2024-06-20T12:00:00Z'
 *         exceptionTypeUpdatedAt: '2024-06-20T13:00:00Z'
 *         exceptionTypeDeletedAt: null
 *         shiftExceptions:
 *           - # Example ShiftException object
 */
export default class ExceptionType extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare exceptionTypeId: number

  @column()
  declare exceptionTypeTypeName: string

  @column()
  declare exceptionTypeIcon: string

  @column()
  declare exceptionTypeSlug: string

  @column()
  declare exceptionTypeNeedCheckInTime: number | null

  @column()
  declare exceptionTypeNeedCheckOutTime: number | null

  @column()
  declare exceptionTypeNeedReason: number | null

  @column()
  declare exceptionTypeNeedEnjoymentOfSalary: number | null

  @column()
  declare exceptionTypeNeedPeriodInDays: number | null

  @column()
  declare exceptionTypeNeedPeriodInHours: number | null

  @column.dateTime({ autoCreate: true })
  declare exceptionTypeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare exceptionTypeUpdatedAt: DateTime

  @column.dateTime({ columnName: 'exception_type_deleted_at' })
  declare deletedAt: DateTime | null

  @hasMany(() => ShiftException)
  declare shiftExceptions: relations.HasMany<typeof ShiftException>
}
