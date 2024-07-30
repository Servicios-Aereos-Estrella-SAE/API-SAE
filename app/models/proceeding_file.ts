import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
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
 *           type: string
 *           description: Proceeding file status
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
export default class ProceedingFile extends BaseModel {
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

  @column.dateTime({ autoCreate: true })
  declare proceedingFileCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare proceedingFileUpdatedAt: DateTime

  @column.dateTime()
  declare proceedingFileDeletedAt: DateTime
}
