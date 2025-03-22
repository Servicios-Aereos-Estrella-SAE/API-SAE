import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *      EmployeeShiftChange:
 *        type: object
 *        properties:
 *          employeeShiftChangeId:
 *            type: number
 *            description: Employee shift change ID
 *          employeeIdFrom:
 *            type: number
 *            description: Employee id from
 *          shiftIdFrom:
 *            type: number
 *            description: Shift id from
 *          employeeShiftChangeDateFrom:
 *           type: string
 *           format: date
 *           description: Employee shift change date from
 *          employeeShiftChangeDateFromIsRestDay:
 *           type: number
 *           description: Employee shift change date from is rest day
 *          employeeIdTo:
 *            type: number
 *            description: Employee id to
 *          shiftIdTo:
 *            type: number
 *            description: Shift id to
 *          employeeShiftChangeDateTo:
 *           type: string
 *           format: date
 *           description: Employee shift change date to
 *          employeeShiftChangeDateToIsRestDay:
 *           type: number
 *           description: Employee shift change date to is rest day
 *          employeeShiftChangeCreatedAt:
 *            type: string
 *            format: date-time
 *          employeeShiftChangeUpdatedAt:
 *            type: string
 *            format: date-time
 *          employeeShiftChangeDeletedAt:
 *            type: string
 *            format: date-time
 *            nullable: true
 */
export default class EmployeeShiftChange extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare employeeShiftChangeId: number

  @column()
  declare employeeIdFrom: number

  @column()
  declare shiftIdFrom: number

  @column()
  declare employeeShiftChangeDateFrom: string

  @column()
  declare employeeShiftChangeDateFromIsRestDay: number

  @column()
  declare employeeIdTo: number

  @column()
  declare shiftIdTo: number

  @column()
  declare employeeShiftChangeDateTo: string

  @column()
  declare employeeShiftChangeDateToIsRestDay: number

  @column.dateTime({ autoCreate: true })
  declare employeeShiftChangeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeShiftChangeUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_shift_change_deleted_at' })
  declare deletedAt: DateTime | null
}
