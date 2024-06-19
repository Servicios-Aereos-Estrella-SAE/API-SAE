import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ShiftException from './shift_exception.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class ExceptionType extends BaseModel {
  @column({ isPrimary: true })
  declare exception_type_id: number

  @column()
  declare exception_type_type_name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime

  @hasMany(() => ShiftException)
  declare shiftExceptions: relations.HasMany<typeof ShiftException>
}
