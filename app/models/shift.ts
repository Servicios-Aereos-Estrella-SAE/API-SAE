import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import EmployeeShift from './employee_shift.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Shift extends BaseModel {
  @column({ isPrimary: true })
  declare shift_id: number

  @column()
  declare shift_name: string

  @column()
  declare day_start: number

  @column()
  declare time_start: string

  @column()
  declare active_hours: number

  @column()
  declare rest_days: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime

  @hasMany(() => EmployeeShift)
  declare employees: relations.HasMany<typeof EmployeeShift>
}
