import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *     ProceedingFileType:
 *       type: object
 *       properties:
 *         proceedingFileTypeId:
 *           type: number
 *           description: Proceeding file type ID
 *         proceedingFileTypeName:
 *           type: string
 *           description: Proceeding file type name
 *         proceedingFileTypeIcon:
 *           type: string
 *           description: Proceeding file type icon
 *         proceedingFileTypeSlug:
 *           type: string
 *           description: Proceeding file type SLUG
 *         proceedingFileTypeAreaToUse:
 *           type: string
 *           description: Proceeding file type area to use
 *         proceedingFileTypeActive:
 *           type: string
 *           description: Proceeding file type status
 *         proceedingFileTypeCreatedAt:
 *           type: string
 *           format: date-time
 *         proceedingFileTypeUpdatedAt:
 *           type: string
 *           format: date-time
 *         proceedingFileTypeDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
export default class ProceedingFileType extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare proceedingFileTypeId: number

  @column()
  declare proceedingFileTypeName: string

  @column()
  declare proceedingFileTypeIcon: string

  @column()
  declare proceedingFileTypeSlug: string

  @column()
  declare proceedingFileTypeAreaToUse: string

  @column()
  declare proceedingFileTypeActive: number

  @column.dateTime({ autoCreate: true })
  declare proceedingFileTypeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare proceedingFileTypeUpdatedAt: DateTime

  @column.dateTime({ columnName: 'proceeding_file_type_deleted_at' })
  declare deletedAt: DateTime | null
}
