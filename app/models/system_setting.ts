import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import SystemSettingSystemModule from './system_setting_system_module.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

/**
 * @swagger
 * components:
 *   schemas:
 *      SystemSetting:
 *        type: object
 *        properties:
 *          systemSettingId:
 *            type: number
 *            description: System setting id
 *          systemSettingTradeName:
 *            type: string
 *            description: System setting trade name
 *          systemSettingLogo:
 *            type: string
 *            description: System setting logo
 *          systemSettingBanner:
 *            type: string
 *            description: System setting banner
 *          systemSettingSidebarColor:
 *            type: string
 *            description: System setting sidebar color
 *          systemSettingActive:
 *            type: number
 *            description: System setting status
 *          systemSettingCreatedAt:
 *            type: string
 *          systemSettingUpdatedAt:
 *            type: string
 *          systemSettingDeletedAt:
 *            type: string
 *
 */
export default class SystemSetting extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare systemSettingId: number

  @column()
  declare systemSettingTradeName: string

  @column()
  declare systemSettingLogo: string

  @column()
  declare systemSettingBanner: string

  @column()
  declare systemSettingSidebarColor: string

  @column()
  declare systemSettingActive: number

  @column.dateTime({ autoCreate: true })
  declare systemSettingCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare systemSettingUpdatedAt: DateTime

  @column.dateTime({ columnName: 'system_setting_deleted_at' })
  declare deletedAt: DateTime | null

  @hasMany(() => SystemSettingSystemModule, {
    foreignKey: 'systemSettingId',
    onQuery(query) {
      if (!query.isRelatedSubQuery) {
        query.preload('systemModule')
      }
    },
  })
  declare systemSettingSystemModules: HasMany<typeof SystemSettingSystemModule>
}
