import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'

/**
 * @swagger
 * components:
 *   schemas:
 *      ProceedingFileHasStatus:
 *        type: object
 *        properties:
 *          proceedingFileHasStatusId:
 *            type: number
 *            description: Proceeding file has status id
 *          proceedingFileId:
 *            type: number
 *            description: Proceeding file id
 *          proceedingFileStatusId:
 *            type: number
 *            description: Proceeding file status id
 *          proceedingFileHasStatusCretedAt:
 *            type: string
 *          proceedingFileHasStatusUpdatedAt:
 *            type: string
 *          proceedingFileHasStatusDeletedAt:
 *            type: string
 *
 */
export default class ProceedingFileHasStatus extends compose(BaseModel, SoftDeletes) {
  static table = 'proceeding_file_has_status'

  @column({ isPrimary: true })
  declare proceedingFileHasStatusId: number

  @column()
  declare proceedingFileId: number

  @column()
  declare proceedingFileStatusId: number

  @column.dateTime({ autoCreate: true })
  declare proceedingFileHasStatusCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare proceedingFileHasStatusUpdatedAt: DateTime

  @column.dateTime({ columnName: 'proceeding_file_has_status_deleted_at' })
  declare deletedAt: DateTime | null
}
