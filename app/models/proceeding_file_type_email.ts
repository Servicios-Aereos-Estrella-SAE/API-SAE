import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'

/**
 * @swagger
 * components:
 *   schemas:
 *      ProceedingFileTypeEmail:
 *        type: object
 *        properties:
 *          proceedingFileTypeEmailId:
 *            type: number
 *            description: Proceeding file type email id
 *          proceedingFileTypeId:
 *            type: number
 *            description: Proceeding file type id
 *          proceedingFileTypeEmailEmail:
 *            type: string
 *            description: Proceeding file type email email
 *          proceedingFileTypeEmailCretedAt:
 *            type: string
 *          proceedingFileTypeEmailUpdatedAt:
 *            type: string
 *          proceedingFileTypeEmailDeletedAt:
 *            type: string
 *
 */
export default class ProceedingFileTypeEmail extends compose(BaseModel, SoftDeletes) {
  static table = 'proceeding_file_type_emails'

  @column({ isPrimary: true })
  declare proceedingFileTypeEmailId: number

  @column()
  declare proceedingFileTypeId: number

  @column()
  declare proceedingFileTypeEmailEmail: string

  @column.dateTime({ autoCreate: true })
  declare proceedingFileTypeEmailCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare proceedingFileTypeEmailUpdatedAt: DateTime

  @column.dateTime({ columnName: 'proceeding_file_type_email_deleted_at' })
  declare deletedAt: DateTime | null
}
