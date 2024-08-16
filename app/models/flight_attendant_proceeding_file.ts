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
 *      FlightAttendantProceedingFile:
 *        type: object
 *        properties:
 *          flightAttendantProceedingFileId:
 *            type: number
 *            description: FlightAttendant proceeding file id
 *          flightAttendantId:
 *            type: number
 *            description: FlightAttendant id
 *          proceedingFileId:
 *            type: number
 *            description: Proceeding file id
 *          flightAttendantProceedingFileCreatedAt:
 *            type: string
 *          flightAttendantProceedingFileUpdatedAt:
 *            type: string
 *          flightAttendantProceedingFileDeletedAt:
 *            type: string
 *
 */
export default class FlightAttendantProceedingFile extends compose(BaseModel, SoftDeletes) {
  static table = 'flight_attendant_proceeding_files'

  @column({ isPrimary: true })
  declare flightAttendantProceedingFileId: number

  @column()
  declare flightAttendantId: number

  @column()
  declare proceedingFileId: number

  @column.dateTime({ autoCreate: true })
  declare flightAttendantProceedingFileCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare flightAttendantProceedingFileUpdatedAt: DateTime

  @column.dateTime({ columnName: 'flight_attendant_proceeding_file_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => ProceedingFile, {
    foreignKey: 'proceedingFileId',
  })
  declare proceedingFile: BelongsTo<typeof ProceedingFile>
}
