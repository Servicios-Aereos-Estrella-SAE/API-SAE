import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import FlightAttendant from './flight_attendant.js'
import Pilot from './pilot.js'
import Aircraft from './aircraft.js'
import Customer from './customer.js'
import ReservationLeg from './reservation_leg.js'
import ReservationNote from './reservation_note.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         reservationId:
 *           type: number
 *           description: Reservation Id
 *         reservationUuid:
 *           type: string
 *           description: Reservation uuid
 *         customerId:
 *           type: number
 *           description: Customer Id
 *         aircraftId:
 *           type: number
 *           description: Aircraft Id
 *         pilotSicId:
 *           type: number
 *           description: Pilot SIC Id
 *         pilotPicId:
 *           type: number
 *           description: Pilot PIC Id
 *         flightAttendantId:
 *           type: number
 *           description: Flight Attendant Id
 *         reservationSubtotal:
 *           type: number
 *           description: Subtotal
 *         reservationTaxFactor:
 *           type: number
 *           description: Tax Factor
 *         reservationTax:
 *           type: number
 *           description: Tax amount
 *         reservationTotal:
 *           type: number
 *           description: Total amount
 *         reservationCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         reservationUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Update timestamp
 *         reservationDeletedAt:
 *           type: string
 *           format: date-time
 *           description: Soft delete timestamp
 */
export default class Reservation extends compose(BaseModel, SoftDeletes) {
  /**
   * Identificador primario de la reservación.
   */
  @column({ isPrimary: true })
  declare reservationId: number

  /**
   * FK hacia la tabla customers (customer_id).
   */
  @column()
  declare customerId: number

  /**
   * FK hacia la tabla aircraft (aircraft_id).
   */
  @column()
  declare aircraftId: number

  /**
   * FK hacia la tabla pilots (pilot_sic_id).
   */
  @column()
  declare pilotSicId: number

  /**
   * FK hacia la tabla pilots (pilot_pic_id).
   */
  @column()
  declare pilotPicId: number

  /**
   * FK hacia la tabla flight_attendants (flight_attendant_id).
   */
  @column()
  declare flightAttendantId: number

  /**
   * Subtotal de la reservación.
   */
  @column()
  declare reservationSubtotal: number

  /**
   * Factor de impuesto para la reservación (opcional).
   */
  @column()
  declare reservationTaxFactor: number | null

  /**
   * Impuesto calculado a partir del subtotal y factor.
   */
  @column()
  declare reservationTax: number

  /**
   * Total a pagar por la reservación.
   */
  @column()
  declare reservationTotal: number

  /**
   * Fecha/hora de creación de la reservación.
   */
  @column.dateTime({ autoCreate: true, columnName: 'reservation_created_at' })
  declare reservationCreatedAt: DateTime

  /**
   * Fecha/hora de última actualización de la reservación.
   */
  @column.dateTime({ autoUpdate: true, columnName: 'reservation_updated_at' })
  declare reservationUpdatedAt: DateTime | null

  /**
   * Fecha/hora de borrado suave (Soft Delete).
   */
  @column.dateTime({ columnName: 'reservation_deleted_at' })
  declare deletedAt: DateTime | null

  /**
   * Relación belongsTo con el modelo Customer.
   */
  @belongsTo(() => Customer, {
    foreignKey: 'customerId',
  })
  declare customer: BelongsTo<typeof Customer>

  /**
   * Relación belongsTo con el modelo Aircraft.
   */
  @belongsTo(() => Aircraft, {
    foreignKey: 'aircraftId',
  })
  declare aircraft: BelongsTo<typeof Aircraft>

  /**
   * Relación belongsTo con el modelo Pilot (SIC).
   */
  @belongsTo(() => Pilot, {
    foreignKey: 'pilotSicId',
  })
  declare pilotSic: BelongsTo<typeof Pilot>

  /**
   * Relación belongsTo con el modelo Pilot (PIC).
   */
  @belongsTo(() => Pilot, {
    foreignKey: 'pilotPicId',
  })
  declare pilotPic: BelongsTo<typeof Pilot>

  /**
   * Relación belongsTo con el modelo FlightAttendant.
   */
  @belongsTo(() => FlightAttendant, {
    foreignKey: 'flightAttendantId',
  })
  declare flightAttendant: BelongsTo<typeof FlightAttendant>

  /**
   * Relación hasMany con el modelo ReservationLeg.
   */
  @hasMany(() => ReservationLeg, {
    foreignKey: 'reservationId',
  })
  declare reservationLegs: HasMany<typeof ReservationLeg>

  /**
   * Relación hasMany con el modelo ReservationNote.
   */
  @hasMany(() => ReservationNote, {
    foreignKey: 'reservationId',
  })
  declare reservationNotes: HasMany<typeof ReservationNote>
}
