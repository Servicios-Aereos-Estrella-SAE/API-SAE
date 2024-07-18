import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *     Icon:
 *       type: object
 *       properties:
 *         iconId:
 *           type: number
 *           description: Icon ID
 *         iconName:
 *           type: string
 *           description: Name of the icon
 *         iconSvg:
 *           type: string
 *           description: SVG content of the icon
 *         iconCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the icon was created
 *         iconUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the icon was last updated
 *         iconDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the icon was soft-deleted
 *       example:
 *         iconId: 1
 *         iconName: "Holiday Tree"
 *         iconSvg: "<svg>...</svg>"
 *         iconCreatedAt: '2024-06-20T12:00:00Z'
 *         iconUpdatedAt: '2024-06-20T13:00:00Z'
 *         iconDeletedAt: null
 */
export default class Icon extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare iconId: number

  @column()
  declare iconName: string

  @column()
  declare iconSvg: string

  @column.dateTime({ autoCreate: true })
  declare iconCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare iconUpdatedAt: DateTime

  @column.dateTime({ columnName: 'icon_deleted_at' })
  declare deletedAt: DateTime | null
}
