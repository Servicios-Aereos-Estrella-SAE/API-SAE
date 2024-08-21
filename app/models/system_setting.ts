import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'

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
  declare systemSettingSidebarColor: string

  @column()
  declare systemSettingActive: number

  @column.dateTime({ autoCreate: true })
  declare systemSettingCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare systemSettingUpdatedAt: DateTime

  @column.dateTime({ columnName: 'system_setting_deleted_at' })
  declare deletedAt: DateTime | null
}
