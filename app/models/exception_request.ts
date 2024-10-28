import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import * as relations from '@adonisjs/lucid/types/relations'
import Employee from './employee.js'
import ExceptionType from './exception_type.js'

export default class ExceptionRequest extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  exceptionRequestId!: number

  @column()
  employeeId!: number

  @column()
  exceptionTypeId!: number

  @column()
  exceptionRequestStatus!: 'requested' | 'pending' | 'accepted' | 'refused'

  @column()
  exceptionRequestDescription?: string

  @column.dateTime({ autoCreate: true })
  exceptionRequestCreatedAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare exceptionRequestUpdatedAt: DateTime

  @column.dateTime({ columnName: 'exception_request_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Employee)
  employee!: relations.BelongsTo<typeof Employee>

  @belongsTo(() => ExceptionType)
  exceptionType!: relations.BelongsTo<typeof ExceptionType>
}
