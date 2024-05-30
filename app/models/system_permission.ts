import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import SystemModule from './system_module.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class SystemPermission extends BaseModel {
  // public static table = 'system_permissions'

  @column({ isPrimary: true })
  declare system_permission_id: number

  @column()
  declare system_permission_name: string

  @column()
  declare system_module_id: number

  @belongsTo(() => SystemModule, {
    foreignKey: 'system_module_id',
  })
  declare module: BelongsTo<typeof SystemModule>

  @column.dateTime({ autoCreate: true })
  declare system_permission_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare system_permission_updated_at: DateTime

  @column()
  declare system_permission_deleted_at: DateTime | null
}
