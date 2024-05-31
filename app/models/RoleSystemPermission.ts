import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

/**
 * @swagger
 * components:
 *   schemas:
 *      RoleSystemPermission:
 *        type: object
 *        properties:
 *          role_system_permission_id:
 *            type: number
 *            description: Id del permiso en el sistema del rol
 *          role_id:
 *            type: number
 *            description: Id del rol
 *          system_permission_id:
 *            type: number
 *            description: Id del Permiso del sistema
 *          role_system_permission_created_at:
 *            type: string
 *          role_system_permission_updated_at:
 *            type: string
 *          role_system_permission_deleted_at:
 *            type: string
 *
 */

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
