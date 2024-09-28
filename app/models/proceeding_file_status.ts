import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *     ProceedingFileStatus:
 *       type: object
 *       properties:
 *         proceedingFileStatusId:
 *           type: number
 *           description: Proceeding file status ID
 *         proceedingFileStatusName:
 *           type: string
 *           description: Proceeding file status name
 *         proceedingFileStatusSlug:
 *           type: string
 *           description: Proceeding file status SLUG
 *         proceedingFileStatusCreatedAt:
 *           type: string
 *           format: date-time
 *         proceedingFileStatusUpdatedAt:
 *           type: string
 *           format: date-time
 *         proceedingFileStatusDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
export default class ProceedingFileStatus extends compose(BaseModel, SoftDeletes) {
  static get table() {
    return 'proceeding_file_status'
  }
  @column({ isPrimary: true })
  declare proceedingFileStatusId: number

  @column()
  declare proceedingFileStatusName: string

  @column()
  declare proceedingFileStatusSlug: string

  @column.dateTime({ autoCreate: true })
  declare proceedingFileStatusCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare proceedingFileStatusUpdatedAt: DateTime

  @column.dateTime({ columnName: 'proceeding_file_status_deleted_at' })
  declare deletedAt: DateTime | null
}
