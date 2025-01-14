import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import Airport from './airport.js'
import Reservation from './reservation.js'
/**
 * @swagger
 * components:
 *   schemas:
 *     ReservationLeg:
 *       type: object
 *       properties:
 *         reservationLegId:
 *           type: number
 *           description: Identificador primario de la tabla reservation_legs
 *         reservationLegUuid:
 *           type: string
 *           description: UUID para la pierna de la reservación (opcional)
 *         reservationLegFromLocation:
 *           type: string
 *           description: Nombre o código de la ubicación de salida (si no se usa airport_id)
 *         reservationLegToLocation:
 *           type: string
 *           description: Nombre o código de la ubicación de llegada (si no se usa airport_id)
 *         airportDepartureId:
 *           type: number
 *           description: Llave foránea que apunta a la tabla airports (salida)
 *         airportDestinationId:
 *           type: number
 *           description: Llave foránea que apunta a la tabla airports (destino)
 *         reservationLegDepartureDate:
 *           type: string
 *           format: date
 *         reservationLegDepartureTime:
 *           type: string
 *           format: time
 *         reservationLegArriveDate:
 *           type: string
 *           format: date
 *         reservationLegArriveTime:
 *           type: string
 *           format: time
 *         reservationLegPax:
 *           type: number
 *           description: Cantidad de pasajeros
 *         reservationLegTravelTime:
 *           type: string
 *           description: Duración estimada del vuelo (ej. "02:30" para 2h 30m)
 *         reservationLegDistanceMn:
 *           type: number
 *           description: Distancia en millas náuticas
 *         reservationId:
 *           type: number
 *           description: FK a la tabla reservations
 *         reservationLegCreatedAt:
 *           type: string
 *           format: date-time
 *         reservationLegUpdatedAt:
 *           type: string
 *           format: date-time
 *         reservationLegDeletedAt:
 *           type: string
 *           format: date-time
 */
export default class ReservationLeg extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true, columnName: 'reservation_leg_id' })
  declare reservationLegId: number

  @column({ columnName: 'reservation_leg_uuid' })
  declare reservationLegUuid: string | null

  // Ubicación textual (nullable)
  @column({ columnName: 'reservation_leg_from_location' })
  declare reservationLegFromLocation: string | null

  @column({ columnName: 'reservation_leg_to_location' })
  declare reservationLegToLocation: string | null

  // FKs a airports
  @column({ columnName: 'airport_departure_id' })
  declare airportDepartureId: number

  @column({ columnName: 'airport_destination_id' })
  declare airportDestinationId: number

  // Fechas y horas
  @column.date({ columnName: 'reservation_leg_departure_date' })
  declare reservationLegDepartureDate: DateTime | null

  @column.date({ columnName: 'reservation_leg_arrive_date' })
  declare reservationLegArriveDate: DateTime | null

  // Para 'time' se puede usar .column() con string,
  // o .dateTime() si lo guardas como timestamp. Aquí lo dejamos como string.
  @column({ columnName: 'reservation_leg_departure_time' })
  declare reservationLegDepartureTime: string | null

  @column({ columnName: 'reservation_leg_arrive_time' })
  declare reservationLegArriveTime: string | null

  @column({ columnName: 'reservation_leg_pax' })
  declare reservationLegPax: number | null

  // Duración y distancia
  @column({ columnName: 'reservation_leg_travel_time' })
  declare reservationLegTravelTime: string | null

  @column({ columnName: 'reservation_leg_distance_mn' })
  declare reservationLegDistanceMn: number | null

  // FK con reservations
  @column({ columnName: 'reservation_id' })
  declare reservationId: number

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'reservation_leg_created_at' })
  declare reservationLegCreatedAt: DateTime

  @column.dateTime({ autoUpdate: true, columnName: 'reservation_leg_updated_at' })
  declare reservationLegUpdatedAt: DateTime | null

  @column.dateTime({ columnName: 'reservation_leg_deleted_at' })
  declare deletedAt: DateTime | null

  /**
   * RELACIONES
   */

  /**
   * Una pierna (leg) pertenece a una reservación.
   */
  @belongsTo(() => Reservation, {
    foreignKey: 'reservationId',
  })
  declare reservation: BelongsTo<typeof Reservation>

  /**
   * Una pierna puede tener un aeropuerto de salida.
   */
  @belongsTo(() => Airport, {
    foreignKey: 'airportDepartureId',
  })
  declare airportDeparture: BelongsTo<typeof Airport>

  /**
   * Una pierna puede tener un aeropuerto de destino.
   */
  @belongsTo(() => Airport, {
    foreignKey: 'airportDestinationId',
  })
  declare airportDestination: BelongsTo<typeof Airport>
}
