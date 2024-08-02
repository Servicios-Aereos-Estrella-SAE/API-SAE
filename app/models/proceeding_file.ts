import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import ProceedingFileType from './proceeding_file_type.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
/**
 * @swagger
 * components:
 *   schemas:
 *     ProceedingFile:
 *       type: object
 *       properties:
 *         proceedingFileId:
 *           type: number
 *           description: Proceeding file ID
 *         proceedingFileName:
 *           type: string
 *           description: Proceeding file name
 *         proceedingFilePath:
 *           type: string
 *           description: Proceeding file path
 *         proceedingFileTypeId:
 *           type: number
 *           description: Proceeding file type id
 *         proceedingFileExpirationAt:
 *           type: string
 *           format: date-time
 *         proceedingFileActive:
 *           type: number
 *           description: Proceeding file status
 *         proceedingFileIdentify:
 *           type: string
 *           description: Proceeding file identify
 *         proceedingFileUuid:
 *           type: string
 *           description: Proceeding file uuid
 *         proceedingFileCreatedAt:
 *           type: string
 *           format: date-time
 *         proceedingFileUpdatedAt:
 *           type: string
 *           format: date-time
 *         proceedingFileDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
export default class ProceedingFile extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare proceedingFileId: number

  @column()
  declare proceedingFileName: string

  @column()
  declare proceedingFilePath: string

  @column()
  declare proceedingFileTypeId: number

  @column()
  declare proceedingFileExpirationAt: string

  @column()
  declare proceedingFileActive: number

  @column()
  declare proceedingFileIdentify: string

  @column()
  declare proceedingFileUuid: string

  @column.dateTime({ autoCreate: true })
  declare proceedingFileCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare proceedingFileUpdatedAt: DateTime

  @column.dateTime({ columnName: 'proceeding_file_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => ProceedingFileType, {
    foreignKey: 'proceedingFileTypeId',
  })
  declare proceedingFileType: BelongsTo<typeof ProceedingFileType>
}
