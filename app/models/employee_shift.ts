import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Employee from './employee.js'
import Shift from './shift.js'
import * as relations from '@adonisjs/lucid/types/relations'
/**
 * @swagger
 * components:
 *   schemas:
 *     EmployeeShift:
 *       type: object
 *       properties:
 *         employeShiftId:
 *           type: number
 *           description: Employee shift ID
 *         employeeId:
 *           type: number
 *           description: ID of the associated employee
 *           nullable: false
 *         shiftId:
 *           type: number
 *           nullable: false
 *           description: ID of the associated shift
 *         employeShiftCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the employee shift was created
 *         employeShiftUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the employee shift was last updated
 *         employeShiftDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the employee shift was soft-deleted
 *         employee:
 *           type: object
 *           description: Details of the associated employee
 *         shift:
 *           type: object
 *           description: Details of the associated shift
 *       example:
 *         employeShiftId: 1
 *         employeeId: 1
 *         shiftId: 1
 *         employeShiftCreatedAt: '2024-06-20T12:00:00Z'
 *         employeShiftUpdatedAt: '2024-06-20T13:00:00Z'
 *         employeShiftDeletedAt: null
 *         employee:
 *           # Example employee object
 *         shift:
 *           # Example shift object
 */

export default class EmployeeShift extends BaseModel {
  @column({ isPrimary: true })
  declare employeeShiftId: number

  @column()
  declare employeeId: number

  @column()
  declare shiftId: number

  @column.dateTime({ autoCreate: true })
  declare employeShiftsCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeShiftsUpdatedAt: DateTime

  @column.dateTime()
  declare employeShiftsDeletedAt: DateTime

  @column.dateTime()
  declare employeShiftsApplySince: DateTime

  @belongsTo(() => Employee, {
    foreignKey: 'employeeId',
  })
  declare employee: relations.BelongsTo<typeof Employee>

  @belongsTo(() => Shift, {
    foreignKey: 'shiftId',
  })
  declare shift: relations.BelongsTo<typeof Shift>
}
