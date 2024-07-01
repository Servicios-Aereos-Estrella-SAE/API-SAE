import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import AssistPageSync from '#models/assist_page_sync'
import type { HasMany } from '@adonisjs/lucid/types/relations'
/**
 * @swagger
 * components:
 *   schemas:
 *     AssistStatusSync:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        dateRequestSync:
 *          type: string
 *          format: date-time
 *        dateTimeStartSync:
 *          type: string
 *          format: date-time
 *        dateTimeEndSync:
 *          type: string
 *          format: date-time
 *        dateTimeLimitSync:
 *          type: string
 *          format: date-time
 *        statusSync:
 *          type: string
 *          enum: [in_process, success, failed]
 *        pageTotalSync:
 *          type: integer
 *        itemsTotalSync:
 *          type: integer
 *        pageSyncs:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/AssistPageSync'
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
export default class AssistStatusSync extends BaseModel {
  static table = 'assist_status_syncs'
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare dateRequestSync: DateTime

  @column.dateTime()
  declare dateTimeStartSync: DateTime

  @column.dateTime()
  declare dateTimeEndSync: DateTime

  @column.dateTime()
  declare dateTimeLimitSync: DateTime

  @column()
  declare statusSync: 'in_process' | 'success' | 'failed'

  @column()
  declare pageTotalSync: number

  @column()
  declare itemsTotalSync: number

  @hasMany(() => AssistPageSync)
  declare pageSyncs: HasMany<typeof AssistPageSync>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
