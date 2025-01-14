import Reservation from '#models/reservation'
import { ReservationFilterSearchInterface } from '../interfaces/reservation_filter_search_interface.js'
// Importa aquí otros modelos si necesitas verificar datos (ej. Customer, Pilot, etc.)

export default class ReservationService {
  /**
   * Listado de reservations con paginación y/o filtros
   */
  async index(filters: ReservationFilterSearchInterface) {
    const query = Reservation.query().whereNull('reservation_deleted_at')

    // Filtro de búsqueda opcional
    if (filters.search) {
      // query.where((subQuery) => {
      //   subQuery.whereRaw('UPPER(reservation_uuid) LIKE ?', [`%${filters.search?.toUpperCase()}%`])
      //   // Agrega tus orWhereHas(...) si deseas buscar en relaciones, igual que en customers
      // })
    }

    // Preloads opcionales, por ejemplo: .preload('customer'), .preload('pilotPic'), etc.
    // query.preload('customer')
    // query.preload('pilotPic')
    // ...

    // Ordena por la PK, por ejemplo:
    query.orderBy('reservation_id')

    // Retorna la paginación
    const reservations = await query.paginate(filters.page, filters.limit)
    return reservations
  }

  /**
   * Crear nueva reservation
   */
  async create(reservation: Reservation) {
    const newReservation = new Reservation()
    newReservation.customerId = reservation.customerId
    newReservation.aircraftId = reservation.aircraftId
    newReservation.pilotSicId = reservation.pilotSicId
    newReservation.pilotPicId = reservation.pilotPicId
    newReservation.flightAttendantId = reservation.flightAttendantId
    newReservation.reservationSubtotal = reservation.reservationSubtotal
    newReservation.reservationTaxFactor = reservation.reservationTaxFactor
    newReservation.reservationTax = reservation.reservationTax
    newReservation.reservationTotal = reservation.reservationTotal
    await newReservation.save()
    return newReservation
  }

  /**
   * Actualizar reservation existente
   */
  async update(currentReservation: Reservation, reservation: Reservation) {
    currentReservation.customerId = reservation.customerId
    currentReservation.aircraftId = reservation.aircraftId
    currentReservation.pilotSicId = reservation.pilotSicId
    currentReservation.pilotPicId = reservation.pilotPicId
    currentReservation.flightAttendantId = reservation.flightAttendantId
    currentReservation.reservationSubtotal = reservation.reservationSubtotal
    currentReservation.reservationTaxFactor = reservation.reservationTaxFactor
    currentReservation.reservationTax = reservation.reservationTax
    currentReservation.reservationTotal = reservation.reservationTotal
    await currentReservation.save()
    return currentReservation
  }

  /**
   * Eliminar (soft-delete) la reservation
   */
  async delete(currentReservation: Reservation) {
    await currentReservation.delete()
    return currentReservation
  }

  /**
   * Mostrar una reservation por ID
   */
  async show(reservationId: number) {
    const reservation = await Reservation.query()
      .whereNull('reservation_deleted_at')
      .where('reservation_id', reservationId)
      // .preload('customer') // si requieres
      .first()
    return reservation ? reservation : null
  }

  /**
   * Verificar información básica antes de crear/actualizar
   * (Por ejemplo, si el `reservationUuid` ya está en uso)
   */
  async verifyInfo(reservation: Reservation) {
    // Aquí podrías verificar si la FK customerId existe, etc.
    // O si existe el pilotPicId, pilotSicId, etc.

    return {
      status: 200,
      type: 'success',
      title: 'Info verified successfully',
      message: 'Info verified successfully',
      data: { ...reservation },
    }
  }
}
