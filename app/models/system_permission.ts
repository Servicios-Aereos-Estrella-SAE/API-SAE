import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import SystemModule from './system_module.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

/**
 * @swagger
 * components:
 *   schemas:
 *      SystemPermission:
 *        type: object
 *        properties:
 *          systemPermissionId:
 *            type: number
 *            description: System permission id
 *          systemPermissionName:
 *            type: string
 *            description: System permission name
 *          systemModuleId:
 *            type: number
 *            description: System module id
 *          systemPermissionCreatedAt:
 *            type: string
 *          systemPermissionUpdatedAt:
 *            type: string
 *          systemPermissionDeletedAt:
 *            type: string
 *
 */

export default class SystemPermission extends BaseModel {
  @column({ isPrimary: true })
  declare systemPermissionId: number

  @column()
  declare systemPermissionName: string

  @column()
  declare systemModuleId: number

  @belongsTo(() => SystemModule, {
    foreignKey: 'systemModuleId',
  })
  declare module: BelongsTo<typeof SystemModule>

  @column.dateTime({ autoCreate: true })
  declare systemPermissionCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare systemPermissionUpdatedAt: DateTime

  @column()
  declare systemPermissionDeletedAt: DateTime | null
}
