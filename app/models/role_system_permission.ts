import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'

/**
 * @swagger
 * components:
 *   schemas:
 *      RoleSystemPermission:
 *        type: object
 *        properties:
 *          roleSystemPermissionId:
 *            type: number
 *            description: Role system permission id
 *          roleId:
 *            type: number
 *            description: Role id
 *          systemPermissionId:
 *            type: number
 *            description: System permission id
 *          roleSystemPermissionCreatedAt:
 *            type: string
 *          roleSystemPermissionUpdatedAt:
 *            type: string
 *          roleSystemPermissionDeletedAt:
 *            type: string
 *
 */

export default class RoleSystemPermission extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare roleSystemPermissionId: number

  @column()
  declare roleId: number

  @column()
  declare systemPermissionId: number

  @column.dateTime({ autoCreate: true })
  declare roleSystemPermissionCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare roleSystemPermissionUpdatedAt: DateTime

  @column.dateTime({ columnName: 'role_system_permission_deleted_at' })
  declare deletedAt: DateTime | null
}
