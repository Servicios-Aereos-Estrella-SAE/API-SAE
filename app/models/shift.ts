import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import EmployeeShift from './employee_shift.js'
import * as relations from '@adonisjs/lucid/types/relations'
/**
 * @swagger
 * components:
 *   schemas:
 *     Shift:
 *       type: object
 *       properties:
 *         shiftId:
 *           type: number
 *           description: Shift ID
 *         shiftName:
 *           type: string
 *           description: Shift name
 *         shiftDayStart:
 *           type: number
 *           description: Day of the week when the shift starts (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 *         shiftTimeStart:
 *           type: string
 *           format: time
 *           description: Time when the shift starts (HH:MM format)
 *         shiftActiveHours:
 *           type: number
 *           description: Duration of the shift in hours
 *         shiftRestDays:
 *           type: string
 *           description: Comma-separated list of rest days (e.g., "0,1" for Sunday and Monday)
 *         shiftCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the shift was created
 *         shiftUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the shift was last updated
 *         shiftDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the shift was soft-deleted
 *         employees:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmployeeShift'
 *           description: Employees assigned to this shift
 *       example:
 *         shiftId: 1
 *         shiftName: "Morning Shift"
 *         shiftDayStart: 1
 *         shiftTimeStart: "08:00"
 *         shiftActiveHours: 8
 *         shiftRestDays: "0,6"
 *         shiftCreatedAt: '2024-06-20T08:00:00Z'
 *         shiftUpdatedAt: '2024-06-20T09:00:00Z'
 *         shiftDeletedAt: null
 *         employees:
 *           - employeeShiftId: 1
 *             employeeId: 1
 *             shiftId: 1
 *             employeShiftCreatedAt: '2024-06-20T08:30:00Z'
 *             employeShiftUpdatedAt: '2024-06-20T09:30:00Z'
 *             employeShiftDeletedAt: null
 */

export default class Shift extends BaseModel {
  @column({ isPrimary: true })
  declare shiftId: number

  @column()
  declare shiftName: string

  @column()
  declare shiftDayStart: number

  @column()
  declare shiftTimeStart: string

  @column()
  declare shiftActiveHours: number

  @column()
  declare shiftRestDays: string

  @column.dateTime({ autoCreate: true })
  declare shiftCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare shiftUpdatedAt: DateTime

  @column.dateTime()
  declare shiftDeletedAt: DateTime

  @hasMany(() => EmployeeShift)
  declare employees: relations.HasMany<typeof EmployeeShift>
}
