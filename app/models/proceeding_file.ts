import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import ProceedingFileType from './proceeding_file_type.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import EmployeeProceedingFile from './employee_proceeding_file.js'
import FlightAttendantProceedingFile from './flight_attendant_proceeding_file.js'
import PilotProceedingFile from './pilot_proceeding_file.js'
import CustomerProceedingFile from './customer_proceeding_file.js'
import AircraftProceedingFile from './aircraft_proceeding_file.js'
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
 *         proceedingFileObservations:
 *           type: string
 *           description: Proceeding file observations
 *         proceedingFileAfacRights:
 *           type: string
 *           description: Proceeding file AFAC rights
 *         proceedingFileSignatureDate:
 *           type: string
 *           description: Proceeding file signature date
 *         proceedingFileEffectiveStartDate:
 *           type: string
 *           description: Proceeding file effective start date
 *         proceedingFileEffectiveEndDate:
 *           type: string
 *           description: Proceeding file effective end date
 *         proceedingFileInclusionInTheFilesDate:
 *           type: string
 *           description: Proceeding file inclusion in the files date
 *         proceedingFileOperationCost:
 *           type: string
 *           description: Proceeding file operation Cost
 *         proceedingFileCompleteProcess:
 *           type: string
 *           description: Proceeding file complete process
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

  @column()
  declare proceedingFileObservations: string

  @column()
  declare proceedingFileAfacRights: string

  @column()
  declare proceedingFileSignatureDate: Date

  @column()
  declare proceedingFileEffectiveStartDate: Date

  @column()
  declare proceedingFileEffectiveEndDate: Date

  @column()
  declare proceedingFileInclusionInTheFilesDate: Date

  @column()
  declare proceedingFileOperationCost: number

  @column()
  declare proceedingFileCompleteProcess: number

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

  @hasOne(() => AircraftProceedingFile, {
    foreignKey: 'proceedingFileId',
    localKey: 'proceedingFileId',
    onQuery: (query) => {
      query.whereNull('deletedAt').preload('aircraft', (subQuery) => {
        subQuery.preload('aircraftProperty')
      })
    },
  })
  declare aircraftProceedingFile: HasOne<typeof AircraftProceedingFile>

  @hasOne(() => EmployeeProceedingFile, {
    foreignKey: 'proceedingFileId',
    localKey: 'proceedingFileId',
    onQuery: (query) => {
      query.whereNull('deletedAt').preload('employee', (subQuery) => {
        subQuery.preload('person')
      })
    },
  })
  declare employeeProceedingFile: HasOne<typeof EmployeeProceedingFile>

  @hasOne(() => FlightAttendantProceedingFile, {
    foreignKey: 'proceedingFileId',
    localKey: 'proceedingFileId',
    onQuery: (query) => {
      query.whereNull('deletedAt').preload('flightAttendant', (subQuery) => {
        subQuery.preload('person')
      })
    },
  })
  declare flightAttendantProceedingFile: HasOne<typeof FlightAttendantProceedingFile>

  @hasOne(() => PilotProceedingFile, {
    foreignKey: 'proceedingFileId',
    localKey: 'proceedingFileId',
    onQuery: (query) => {
      query.whereNull('deletedAt').preload('pilot', (subQuery) => {
        subQuery.preload('person')
      })
    },
  })
  declare pilotProceedingFile: HasOne<typeof PilotProceedingFile>

  @hasOne(() => CustomerProceedingFile, {
    foreignKey: 'proceedingFileId',
    localKey: 'proceedingFileId',
    onQuery: (query) => {
      query.whereNull('deletedAt').preload('customer', (subQuery) => {
        subQuery.preload('person')
      })
    },
  })
  declare customerProceedingFile: HasOne<typeof CustomerProceedingFile>
}
