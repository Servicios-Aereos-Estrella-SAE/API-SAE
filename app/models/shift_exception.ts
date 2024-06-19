import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Employee from './employee.js'
import ExceptionType from './exception_type.js'

export default class ShiftException extends BaseModel {
  @column({ isPrimary: true })
  declare shift_exception_id: number

  @column()
  declare employee_id: number

  @column()
  declare exception_type_id: number

  @column()
  declare shift_exceptions_date: string

  @column()
  declare shift_exceptions_description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime

  @belongsTo(() => Employee)
  declare employee: relations.BelongsTo<typeof Employee>

  @belongsTo(() => ExceptionType)
  declare exceptionType: relations.BelongsTo<typeof ExceptionType>
}
