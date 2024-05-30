import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Role extends BaseModel {
  // public static table = 'roles'

  @column({ isPrimary: true })
  declare role_id: number

  @column()
  declare role_name: string

  @column()
  declare role_slug: string

  @column()
  declare role_description: string

  @column()
  declare role_active: number

  @column.dateTime({ autoCreate: true })
  declare role_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare role_updated_at: DateTime

  @column()
  declare role_deleted_at: DateTime | null
}
