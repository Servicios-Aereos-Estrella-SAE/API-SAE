import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import PageSync from '#models/page_sync'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class StatusSync extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare dateRequestSync: DateTime

  @column.dateTime()
  declare dateTimeStartSync: DateTime

  @column.dateTime()
  declare dateTimeEndSync: DateTime

  @column.dateTime()
  declare dateTimeLimitSync: DateTime

  @column()
  declare statusSync: 'in_process' | 'success' | 'failed'

  @column()
  declare pageTotalSync: number

  @column()
  declare itemsTotalSync: number

  @hasMany(() => PageSync)
  declare pageSyncs: HasMany<typeof PageSync>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
