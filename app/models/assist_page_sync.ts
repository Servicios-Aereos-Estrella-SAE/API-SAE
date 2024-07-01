import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import StatusSync from '#models/assist_status_sync'

/**
 * @swagger
 * components:
 *   schemas:
 *     AssistPageSync:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        statusSyncId:
 *          type: integer
 *        pageNumber:
 *          type: integer
 *        pageStatus:
 *          type: string
 *          enum: [pending, sync]
 *        itemsCount:
 *          type: integer
 *        statusSync:
 *          $ref: '#/components/schemas/AssistStatusSync'
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
export default class AssistPageSync extends BaseModel {
  static table = 'assist_page_syncs'
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare statusSyncId: number

  @column()
  declare pageNumber: number

  @column()
  declare pageStatus: 'pending' | 'sync'

  @column()
  declare itemsCount: number

  @belongsTo(() => StatusSync, {
    foreignKey: 'statusSyncId',
  })
  declare statusSync: BelongsTo<typeof StatusSync>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
