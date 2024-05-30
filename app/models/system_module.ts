import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class SystemModule extends BaseModel {
  // public static table = 'system_modules'

  @column({ isPrimary: true })
  declare system_module_id: number

  @column()
  declare system_module_name: string

  @column()
  declare system_module_slug: string

  @column()
  declare system_module_description: string

  @column()
  declare system_modules: string

  @column()
  declare system_module_path: string

  @column()
  declare system_module_group: string

  @column()
  declare system_module_active: number

  @column()
  declare system_module_icon: string

  @column.dateTime({ autoCreate: true })
  declare system_module_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare system_module_updated_at: DateTime

  @column()
  declare system_module_deleted_at: DateTime | null
}
