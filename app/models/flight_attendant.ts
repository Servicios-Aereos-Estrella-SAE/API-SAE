import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import Person from './person.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      FlightAttendant:
 *        type: object
 *        properties:
 *          flightAttendantId:
 *            type: number
 *            description: FlightAttendant Id
 *          flightAttendantHireDate:
 *            type: date
 *            description: FlightAttendant hire date
 *          flightAttendantPhoto:
 *            type: string
 *            description: FlightAttendant photo
 *          personId:
 *            type: number
 *            description: Person id
 *          flightAttendantCreatedAt:
 *            type: string
 *          flightAttendantUpdatedAt:
 *            type: string
 *          flightAttendantDeletedAt:
 *            type: string
 *
 */
export default class FlightAttendant extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare flightAttendantId: number

  @column.date()
  declare flightAttendantHireDate: DateTime

  @column()
  declare flightAttendantPhoto: string

  @column()
  declare personId: number

  @column.dateTime({ autoCreate: true })
  declare flightAttendantCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare flightAttendantUpdatedAt: DateTime

  @column.dateTime({ columnName: 'flight_attendant_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Person, {
    foreignKey: 'personId',
  })
  declare person: BelongsTo<typeof Person>
}
