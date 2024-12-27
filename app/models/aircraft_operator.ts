import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *     AircraftOperator:
 *       type: object
 *       properties:
 *         aircraftOperatorId:
 *           type: number
 *           description: Unique identifier for the Aircraft Operator
 *         aircraftOperatorName:
 *           type: string
 *           description: Name of the aircraft operator
 *         aircraftOperatorFiscalName:
 *           type: string
 *           description: Fiscal name (optional) of the aircraft operator
 *         aircraftOperatorImage:
 *           type: string
 *           description: URL or path to the operator's image
 *         aircraftOperatorSlug:
 *           type: string
 *           description: Slug automatically generated from the name
 *         aircraftOperatorActive:
 *           type: boolean
 *           description: Flag indicating if the operator is active (true / false)
 *         aircraftOperatorCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Record creation date
 *         aircraftOperatorUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Record update date
 *         aircraftOperatorDeletedAt:
 *           type: string
 *           format: date-time
 *           description: Record deletion date (used with soft deletes)
 */
export default class AircraftOperator extends compose(BaseModel, SoftDeletes) {
  static table = 'aircraft_operators'

  @column({ isPrimary: true })
  declare aircraftOperatorId: number

  @column()
  declare aircraftOperatorName: string

  @column()
  declare aircraftOperatorFiscalName: string

  @column()
  declare aircraftOperatorImage: string

  @column()
  declare aircraftOperatorSlug: string

  @column()
  declare aircraftOperatorActive: boolean

  @column.dateTime({ autoCreate: true })
  declare aircraftOperatorCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare aircraftOperatorUpdatedAt: DateTime

  @column.dateTime({ columnName: 'aircraft_operator_deleted_at' })
  declare deletedAt: DateTime | null
}
