import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import StatusSync from '#models/status_sync'

export default class PageSync extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare statusSyncId: number

  @column()
  declare pageNumber: number

  @column()
  declare pageStatus: 'pending' | 'sync'

  @column()
  declare itemsCount: number

  @belongsTo(() => StatusSync, {
    foreignKey: 'statusSyncId',
  })
  declare statusSync: BelongsTo<typeof StatusSync>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
