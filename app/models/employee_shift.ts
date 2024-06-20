import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Employee from './employee.js'
import Shift from './shift.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class EmployeeShift extends BaseModel {
  @column({ isPrimary: true })
  declare employeShiftId: number

  @column()
  declare employeeId: number

  @column()
  declare shiftId: number

  @column.dateTime({ autoCreate: true })
  declare employeShiftCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeShiftUpdatedAt: DateTime

  @column.dateTime()
  declare employeShiftDeletedAt: DateTime

  @belongsTo(() => Employee)
  declare employee: relations.BelongsTo<typeof Employee>

  @belongsTo(() => Shift)
  declare shift: relations.BelongsTo<typeof Shift>
}
