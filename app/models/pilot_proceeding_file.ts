import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import ProceedingFile from './proceeding_file.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Pilot from './pilot.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      PilotProceedingFile:
 *        type: object
 *        properties:
 *          pilotProceedingFileId:
 *            type: number
 *            description: Pilot proceeding file id
 *          pilotId:
 *            type: number
 *            description: Pilot id
 *          proceedingFileId:
 *            type: number
 *            description: Proceeding file id
 *          pilotProceedingFileCreatedAt:
 *            type: string
 *          pilotProceedingFileUpdatedAt:
 *            type: string
 *          pilotProceedingFileDeletedAt:
 *            type: string
 *
 */
export default class PilotProceedingFile extends compose(BaseModel, SoftDeletes) {
  static table = 'pilot_proceeding_files'

  @column({ isPrimary: true })
  declare pilotProceedingFileId: number

  @column()
  declare pilotId: number

  @column()
  declare proceedingFileId: number

  @column.dateTime({ autoCreate: true })
  declare pilotProceedingFileCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare pilotProceedingFileUpdatedAt: DateTime

  @column.dateTime({ columnName: 'pilot_proceeding_file_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Pilot, {
    foreignKey: 'pilotId',
  })
  declare pilot: BelongsTo<typeof Pilot>

  @belongsTo(() => ProceedingFile, {
    foreignKey: 'proceedingFileId',
  })
  declare proceedingFile: BelongsTo<typeof ProceedingFile>
}
