import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Employee from './employee.js'
import ExceptionType from './exception_type.js'

export default class ShiftException extends BaseModel {
  @column({ isPrimary: true })
  declare shiftExceptionId: number

  @column()
  declare employeeId: number

  @column()
  declare exceptionTypeId: number

  @column()
  declare shiftExceptionDate: string

  @column()
  declare shiftExceptionDescription: string

  @column.dateTime({ autoCreate: true })
  declare shiftExceptionCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare shiftExceptionUpdatedAt: DateTime

  @column.dateTime()
  declare shiftExceptionDeletedAt: DateTime

  @belongsTo(() => Employee)
  declare employee: relations.BelongsTo<typeof Employee>

  @belongsTo(() => ExceptionType)
  declare exceptionType: relations.BelongsTo<typeof ExceptionType>
}
