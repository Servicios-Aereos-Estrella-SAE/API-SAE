import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import Reservation from './reservation.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     ReservationNote:
 *       type: object
 *       properties:
 *         reservationNoteId:
 *           type: number
 *           description: Reservation Note Id
 *         reservationNoteUuid:
 *           type: string
 *           description: Reservation Note uuid
 *         reservationId:
 *           type: number
 *           description: Id de la reservación (FK a reservations)
 *         reservationNoteContent:
 *           type: string
 *           description: Contenido de la nota
 *         reservationNoteCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha/hora de creación
 *         reservationNoteUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha/hora de última actualización
 *         reservationNoteDeletedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha/hora de borrado suave
 */
export default class ReservationNote extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare reservationNoteId: number

  @column()
  declare reservationNoteUuid: string | null

  @column()
  declare reservationId: number

  @column()
  declare reservationNoteContent: string

  @column.dateTime({ autoCreate: true, columnName: 'reservation_note_created_at' })
  declare reservationNoteCreatedAt: DateTime

  @column.dateTime({ autoUpdate: true, columnName: 'reservation_note_updated_at' })
  declare reservationNoteUpdatedAt: DateTime | null

  @column.dateTime({ columnName: 'reservation_note_deleted_at' })
  declare deletedAt: DateTime | null

  /**
   * RELACIÓN: una nota pertenece a una reservación (belongsTo Reservation).
   */
  @belongsTo(() => Reservation, {
    foreignKey: 'reservationId',
  })
  declare reservation: BelongsTo<typeof Reservation>

  @hasMany(() => ReservationNote, {
    foreignKey: 'reservationId', // campo en la tabla reservation_notes
  })
  declare reservationNotes: HasMany<typeof ReservationNote>
}
