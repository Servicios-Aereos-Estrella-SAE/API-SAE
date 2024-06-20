import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ShiftException from './shift_exception.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class ExceptionType extends BaseModel {
  @column({ isPrimary: true })
  declare exceptionTypeId: number

  @column()
  declare exceptionTypeTypeName: string

  @column()
  declare exceptionTypeIcon: string

  @column()
  declare exceptionTypeSlug: string

  @column.dateTime({ autoCreate: true })
  declare exceptionTypeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare exceptionTypeUpdatedAt: DateTime

  @column.dateTime()
  declare exceptionTypeDeletedAt: DateTime

  @hasMany(() => ShiftException)
  declare shiftExceptions: relations.HasMany<typeof ShiftException>
}
