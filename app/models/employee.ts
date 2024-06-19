import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Department from './department.js'
import Position from './position.js'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'

/**
 * @swagger
 * components:
 *   schemas:
 *      Employee:
 *        type: object
 *        properties:
 *          employeeId:
 *            type: number
 *            description: Employee Id
 *          employeeSyncId:
 *            type: number
 *            description: Imported employee ID
 *          employeeCode:
 *            type: number
 *            description: Employee code
 *          employeeFirstName:
 *            type: string
 *            description: Employee first name
 *          employeeLastName:
 *            type: string
 *            description: Employee last name
 *          employeePayrollNum:
 *            type: string
 *            description: Employee payroll num
 *          employeeHireDate:
 *            type: date
 *            description: Employee hire date
 *          companyId:
 *            type: number
 *            description: Company id
 *          departmentId:
 *            type: number
 *            description: Department id
 *          positionId:
 *            type: number
 *            description: Position id
 *          positionSyncId:
 *            type: number
 *            description: Position sync id
 *          employeeLastSynchronizationAt:
 *            type: string
 *            description: Last synchronization date
 *          employeeCreatedAt:
 *            type: string
 *          employeeUpdatedAt:
 *            type: string
 *          employeeDeletedAt:
 *            type: string
 *
 */
export default class Employee extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare employee_id: number

  @column()
  declare employeeSyncId: number

  @column()
  declare employeeCode: number

  @column()
  declare employeeFirstName: string

  @column()
  declare employeeLastName: string

  @column()
  declare employeePayrollNum: string

  @column.date()
  declare employeeHireDate: DateTime

  @column()
  declare companyId: number

  @column()
  declare departmentId: number

  @column()
  declare departmentSyncId: number

  @column()
  declare positionId: number

  @column()
  declare positionSyncId: number

  @column()
  declare employeeLastSynchronizationAt: Date

  @column.dateTime({ autoCreate: true })
  declare employeeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Department, {
    foreignKey: 'departmentId',
  })
  declare department: BelongsTo<typeof Department>

  @belongsTo(() => Position, {
    foreignKey: 'positionId',
  })
  declare position: BelongsTo<typeof Position>
}
