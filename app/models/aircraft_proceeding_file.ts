import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import ProceedingFile from './proceeding_file.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

/**
 * @swagger
 * components:
 *   schemas:
 *      AircraftProceedingFile:
 *        type: object
 *        properties:
 *          aircraftProceedingFileId:
 *            type: number
 *            description: Aircraft proceeding file id
 *          aircraftId:
 *            type: number
 *            description: Aircraft id
 *          proceedingFileId:
 *            type: number
 *            description: Proceeding file id
 *          aircraftProceedingFileCreatedAt:
 *            type: string
 *          aircraftProceedingFileUpdatedAt:
 *            type: string
 *          aircraftProceedingFileDeletedAt:
 *            type: string
 *
 */
export default class AircraftProceedingFile extends compose(BaseModel, SoftDeletes) {
  static table = 'aircraft_proceeding_files'

  @column({ isPrimary: true })
  declare aircraftProceedingFileId: number

  @column()
  declare aircraftId: number

  @column()
  declare proceedingFileId: number

  @column.dateTime({ autoCreate: true })
  declare aircraftProceedingFileCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare aircraftProceedingFileUpdatedAt: DateTime

  @column.dateTime({ columnName: 'aircraft_proceeding_file_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => ProceedingFile, {
    foreignKey: 'proceedingFileId',
  })
  declare proceedingFile: BelongsTo<typeof ProceedingFile>
}
