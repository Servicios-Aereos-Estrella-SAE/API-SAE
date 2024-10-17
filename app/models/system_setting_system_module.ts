import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import SystemModule from './system_module.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      SystemSettingSystemModule:
 *        type: object
 *        properties:
 *          systemSettingSystemModuleId:
 *            type: number
 *            description: Department position id
 *          systemSettingId:
 *            type: number
 *            description: Department id
 *          systemModuleId:
 *            type: number
 *            description: Position id
 *          systemSettingSystemModuleCreatedAt:
 *            type: string
 *          systemSettingSystemModuleUpdatedAt:
 *            type: string
 *          systemSettingSystemModuleDeletedAt:
 *            type: string
 *
 */
export default class SystemSettingSystemModule extends compose(BaseModel, SoftDeletes) {
  static table = 'system_setting_system_modules'

  @column({ isPrimary: true })
  declare systemSettingSystemModuleId: number

  @column()
  declare systemSettingId: number

  @column()
  declare systemModuleId: number

  @column.dateTime({ autoCreate: true })
  declare systemSettingSystemModuleCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare systemSettingSystemModuleUpdatedAt: DateTime

  @column.dateTime({ columnName: 'system_setting_system_module_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => SystemModule, {
    foreignKey: 'systemModuleId',
  })
  declare systemModule: BelongsTo<typeof SystemModule>
}
