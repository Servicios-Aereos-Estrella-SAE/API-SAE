import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import EmployeeShift from './employee_shift.js'
import * as relations from '@adonisjs/lucid/types/relations'

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
