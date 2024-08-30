import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import SystemModule from './system_module.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'

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
 *          systemPermissionSlug:
 *            type: string
 *            description: System permission slug
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

export default class SystemPermission extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare systemPermissionId: number

  @column()
  declare systemPermissionName: string

  @column()
  declare systemPermissionSlug: string

  @column()
  declare systemModuleId: number

  @column.dateTime({ autoCreate: true })
  declare systemPermissionCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare systemPermissionUpdatedAt: DateTime

  @column()
  declare systemPermissionDeletedAt: DateTime | null

  @column.dateTime({ columnName: 'system_permission_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => SystemModule, {
    foreignKey: 'systemModuleId',
  })
  declare systemModule: BelongsTo<typeof SystemModule>
}
