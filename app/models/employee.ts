import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Department from './department.js'
import Position from './position.js'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import Person from './person.js'
import ShiftException from './shift_exception.js'
import BusinessUnit from './business_unit.js'

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
 *          departmentSyncId:
 *            type: number
 *            description: Department sync id
 *          positionId:
 *            type: number
 *            description: Position id
 *          positionSyncId:
 *            type: number
 *            description: Position sync id
 *          personId:
 *            type: number
 *            description: Person id
 *          businessUnitId:
 *            type: number
 *            description: business id from the employee business unit
 *          employeeAssistDiscriminator:
 *            type: number
 *            description: Flag to identify discrimination on assist
 *          employeeLastSynchronizationAt:
 *            type: string
 *            description: Last synchronization date
 *          employeeTypeOfContract:
 *            type: string
 *            description: Employee type of contract
 *          employeeTerminatedDate:
 *            type: string
 *            description: Employee terminated date
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
  declare employeeId: number

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

  @column()
  declare employeeWorkSchedule: string

  @column()
  declare employeePhoto: string

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
  declare personId: number

  @column()
  declare businessUnitId: number

  @column()
  declare employeeAssistDiscriminator: number

  @column()
  declare employeeLastSynchronizationAt: Date

  @column()
  declare employeeTypeOfContract: string

  @column()
  declare employeeTerminatedDate: Date | string

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

  @belongsTo(() => Person, {
    foreignKey: 'personId',
  })
  declare person: BelongsTo<typeof Person>

  @belongsTo(() => BusinessUnit, {
    foreignKey: 'businessUnitId',
  })
  declare businessUnit: BelongsTo<typeof BusinessUnit>

  @hasMany(() => ShiftException, {
    foreignKey: 'employeeId',
    onQuery: (query) => {
      query.whereNull('shift_exceptions_deleted_at')
      query.preload('exceptionType')
    },
  })
  declare shift_exceptions: HasMany<typeof ShiftException>
}
