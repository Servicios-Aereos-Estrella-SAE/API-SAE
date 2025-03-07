import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *     Bank:
 *       type: object
 *       properties:
 *         bankId:
 *           type: number
 *           description: Bank ID
 *         bankName:
 *           type: string
 *           description: Name of the bank
 *         bankActive:
 *           type: number
 *           description: Bank status
 *         bankCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the bank was created
 *         bankUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the bank was last updated
 *         bankDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the bank was soft-deleted
 *       example:
 *         bankId: 1
 *         bankName: "Bancomer"
 *         bankCreatedAt: '2025-02-06T12:00:00Z'
 *         bankUpdatedAt: '2025-02-06T13:00:00Z'
 *         bankDeletedAt: null
 */
export default class Bank extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare bankId: number

  @column()
  declare bankName: string

  @column()
  declare bankActive: number

  @column.dateTime({ autoCreate: true })
  declare bankCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare bankUpdatedAt: DateTime

  @column.dateTime({ columnName: 'bank_deleted_at' })
  declare deletedAt: DateTime | null
}
