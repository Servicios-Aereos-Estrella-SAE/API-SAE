import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Employee from './employee.js'
import Shift from './shift.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class EmployeeShift extends BaseModel {
  @column({ isPrimary: true })
  declare employe_shift_id: number

  @column()
  declare employee_id: number

  @column()
  declare shift_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime

  @belongsTo(() => Employee)
  declare employee: relations.BelongsTo<typeof Employee>

  @belongsTo(() => Shift)
  declare shift: relations.BelongsTo<typeof Shift>
}
