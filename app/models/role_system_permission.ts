import { BaseModel, column } from '@adonisjs/lucid/orm'
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

export default class RoleSystemPermission extends BaseModel {
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

  @column()
  declare roleSystemPermissionDeletedAt: DateTime | null
}
