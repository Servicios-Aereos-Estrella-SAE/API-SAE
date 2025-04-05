import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'

/**
 * @swagger
 * components:
 *   schemas:
 *      Tolerance:
 *        type: object
 *        properties:
 *          toleranceId:
 *            type: number
 *            description: Tolerance Id
 *          toleranceName:
 *            type: string
 *            description: Tolerance name
 *          toleranceMinutes:
 *            type: number
 *            description: Tolerance minutes
 *          systemSettingId:
 *            type: number
 *            description: System setting id
 *          toleranceCreatedAt:
 *            type: string
 *          toleranceUpdatedAt:
 *            type: string
 *          toleranceDeletedAt:
 *            type: string
 *
 */

export default class Tolerance extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  toleranceId!: number

  @column()
  toleranceName!: string

  @column()
  toleranceMinutes!: number

  @column()
  declare systemSettingId: number

  @column.dateTime({ autoCreate: true })
  declare toleranceCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare toleranceUpdatedAt: DateTime

  @column.dateTime({ columnName: 'tolerance_deleted_at' })
  declare deletedAt: DateTime | null
}
