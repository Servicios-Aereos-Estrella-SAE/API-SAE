import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class RoleSystemPermission extends BaseModel {
  // public static table = 'role_permissions'

  @column({ isPrimary: true })
  declare role_system_permission_id: number

  @column()
  declare role_id: number

  @column()
  declare system_permission_id: number

  @column.dateTime({ autoCreate: true })
  declare role_system_permission_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare role_system_permission_updated_at: DateTime

  @column()
  declare role_system_permission_deleted_at: DateTime | null
}
