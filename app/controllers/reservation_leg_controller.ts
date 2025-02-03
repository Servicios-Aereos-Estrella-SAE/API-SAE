import { HttpContext } from '@adonisjs/core/http'
import ReservationLeg from '#models/reservation_leg'
import ReservationLegService from '#services/reservation_leg_service'
import { createReservationLegValidator } from '#validators/reservation_leg'
import Airport from '#models/airport'

export default class ReservationLegController {
  /**
   * @swagger
   * /api/reservation-legs:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Reservation Legs
   *     summary: Create new reservation leg
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               reservationLegUuid:
   *                 type: string
   *                 description: Reservation Leg UUID
   *               airportDepartureId:
   *                 type: number
   *                 description: FK to airports table (departure)
   *               airportDestinationId:
   *                 type: number
   *                 description: FK to airports table (destination)
   *               reservationId:
   *                 type: number
   *                 description: FK to reservations table
   *     responses:
   *       '201':
   *         description: Reservation leg created successfully
   *       '400':
   *         description: Invalid parameters or missing data
   *       '500':
   *         description: Server error
   */
  async store({ request, response }: HttpContext) {
    // try {
    const data = await request.validateUsing(createReservationLegValidator)
    let reservationLegDepartureDate = request.input('reservationLegDepartureDate')
    reservationLegDepartureDate = (
      reservationLegDepartureDate.split('T')[0] + ' 00:000:00'
    ).replace('"', '')
    let reservationLegArriveDate = request.input('reservationLegArriveDate')
    reservationLegArriveDate = (reservationLegArriveDate.split('T')[0] + ' 00:000:00').replace(
      '"',
      ''
    )
    const reservationLegDepartureTime = request.input('reservationLegDepartureTime')
    const reservationLegArriveTime = request.input('reservationLegArriveTime')
    const requestData = request.only([
      'airportDepartureId',
      'airportDestinationId',
      'reservationId',
      'reservationLegPax',
      'reservationLegTravelTime',
      'reservationLegDistanceMn',
    ])
    let reservationLegData = {
      ...requestData,
      reservationLegDepartureDate,
      reservationLegDepartureTime,
      reservationLegArriveDate,
      reservationLegArriveTime,
    } as ReservationLeg
    const reservationLegService = new ReservationLegService()
    const valid = await reservationLegService.verifyInfo(reservationLegData)
    if (valid.status !== 200) {
      response.status(valid.status)
      return {
        type: valid.type,
        title: valid.title,
        message: valid.message,
        data: { ...data },
      }
    }
    const aircraftDeparture = await Airport.findOrFail(requestData.airportDepartureId)
    const aircraftDestination = await Airport.findOrFail(requestData.airportDestinationId)
    reservationLegData = {
      ...reservationLegData,
      reservationLegFromLocation: aircraftDeparture.airportName,
      reservationLegToLocation: aircraftDestination.airportName,
    }
    // reservationLegFromLocation: aircraftDeparture.airportName,
    //   reservationLegToLocation: aircraftDestination.airportName,
    const reservationLeg = await reservationLegService.create(reservationLegData)

    response.status(201)
    return {
      type: 'success',
      title: 'Reservation Leg',
      message: 'Reservation leg created successfully',
      data: { reservationLeg },
    }
    // } catch (error) {
    //   response.status(500)
    //   return {
    //     type: 'error',
    //     title: 'Server Error',
    //     message: 'An unexpected error has occurred on the server',
    //     error: error.message,
    //   }
    // }
  }

  /**
   * @swagger
   * /api/reservation-legs/{reservationLegId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Reservation Legs
   *     summary: Update reservation leg by ID
   *     parameters:
   *       - name: reservationLegId
   *         in: path
   *         required: true
   *         description: ID of the reservation leg to update
   *         schema:
   *           type: integer
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               airportDepartureId:
   *                 type: number
   *                 description: FK to airports table (departure)
   *               airportDestinationId:
   *                 type: number
   *                 description: FK to airports table (destination)
   *     responses:
   *       '200':
   *         description: Reservation leg updated successfully
   *       '400':
   *         description: Invalid parameters or missing data
   *       '404':
   *         description: Reservation leg not found
   *       '500':
   *         description: Server error
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const reservationLegId = params.reservationLegId
      const data = await request.validateUsing(createReservationLegValidator)
      let reservationLegDepartureDate = request.input('reservationLegDepartureDate')
      reservationLegDepartureDate = (
        reservationLegDepartureDate.split('T')[0] + ' 00:000:00'
      ).replace('"', '')
      let reservationLegArriveDate = request.input('reservationLegArriveDate')
      reservationLegArriveDate = (reservationLegArriveDate.split('T')[0] + ' 00:000:00').replace(
        '"',
        ''
      )
      const reservationLegDepartureTime = request.input('reservationLegDepartureTime')
      const reservationLegArriveTime = request.input('reservationLegArriveTime')
      const requestData = request.only([
        'airportDepartureId',
        'airportDestinationId',
        'reservationId',
        'reservationLegPax',
        'reservationLegTravelTime',
        'reservationLegDistanceMn',
      ])
      const reservationLegData = {
        ...requestData,
        reservationLegDepartureDate,
        reservationLegDepartureTime,
        reservationLegArriveDate,
        reservationLegArriveTime,
      } as ReservationLeg

      const reservationLegService = new ReservationLegService()
      const valid = await reservationLegService.verifyInfo(reservationLegData)
      if (valid.status !== 200) {
        response.status(valid.status)
        return {
          type: valid.type,
          title: valid.title,
          message: valid.message,
          data: { ...data },
        }
      }

      const reservationLeg = await reservationLegService.update(
        reservationLegId,
        reservationLegData
      )

      response.status(200)
      return {
        type: 'success',
        title: 'Reservation Leg',
        message: 'Reservation leg updated successfully',
        data: { reservationLeg },
      }
    } catch (error) {
      response.status(error.status || 500)
      return {
        type: 'error',
        title: 'Update Error',
        message: error.message,
        error: error,
      }
    }
  }

  /**
   * @swagger
   * /api/reservation-legs/{reservationLegId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Reservation Legs
   *     summary: Delete reservation leg by ID
   *     parameters:
   *       - name: reservationLegId
   *         in: path
   *         required: true
   *         description: ID of the reservation leg to delete
   *         schema:
   *           type: integer
   *     responses:
   *       '204':
   *         description: Reservation leg deleted successfully
   *       '404':
   *         description: Reservation leg not found
   *       '500':
   *         description: Server error
   */
  async delete({ params, response }: HttpContext) {
    try {
      const reservationLegId = params.reservationLegId
      const reservationLeg = await ReservationLeg.findOrFail(reservationLegId)
      await reservationLeg.delete()

      response.status(204)
    } catch (error) {
      response.status(error.status || 500).send({
        type: 'error',
        title: 'Delete Error',
        message: error.message,
        error: error,
      })
    }
  }
}
