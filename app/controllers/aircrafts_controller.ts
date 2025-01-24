import type { HttpContext } from '@adonisjs/core/http'
import { formatResponse } from '../helpers/responseFormatter.js'
import Aircraft from '../models/aircraft.js'
import { createAircraftValidator, updateAircraftValidator } from '../validators/aircraft.js'
import { DateTime } from 'luxon'
import Database from '@adonisjs/lucid/services/db'

export default class AircraftsController {
  /**
   * @swagger
   * /api/aircraft:
   *   get:
   *     tags:
   *       - Aircraft
   *     summary: "Retrieve a list of aircrafts"
   *     description: "Fetches a paginated list of aircrafts, optionally filtered by search text."
   *     parameters:
   *       - name: page
   *         in: query
   *         description: "Page number for pagination"
   *         required: false
   *         schema:
   *           type: integer
   *           default: 1
   *       - name: limit
   *         in: query
   *         description: "Number of items per page"
   *         required: false
   *         schema:
   *           type: integer
   *           default: 10
   *       - name: searchText
   *         in: query
   *         description: "Text to search in aircraft registration number"
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: "Successfully fetched list of aircrafts"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Successfully fetched"
   *                 data:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                     per_page:
   *                       type: integer
   *                     current_page:
   *                       type: integer
   *                     last_page:
   *                       type: integer
   *                     first_page:
   *                       type: integer
   *                     items:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           aircraftId:
   *                             type: integer
   *                           aircraftRegistrationNumber:
   *                             type: string
   *                           aircraftSerialNumber:
   *                             type: string
   *                           airportId:
   *                             type: integer
   *                           aircraftPropertiesId:
   *                             type: integer
   *                           active:
   *                             type: integer
   *                           aircraftCreatedAt:
   *                             type: string
   *                             format: date-time
   *                           aircraftUpdatedAt:
   *                             type: string
   *                             format: date-time
   *                           aircraftDeletedAt:
   *                             type: string
   *                             format: date-time
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const searchText = request.input('searchText', '')

    const query = Aircraft.query()
      .preload('pilots', (pilotsQuery) => {
        pilotsQuery.pivotColumns(['aircraft_pilot_role'])
      })
      .preload('aircraftProperty', (aircraftPropertyQuery) => {
        aircraftPropertyQuery.preload('aircraftClass')
      })
      .whereNull('aircraftDeletedAt')
    if (searchText) {
      query.where((builder) => {
        builder.where('aircraftRegistrationNumber', 'like', `%${searchText}%`)
      })
    }
    const aircrafts = await query.paginate(page, limit)

    const formattedResponse = formatResponse(
      'success',
      'Successfully fetched',
      'Resources fetched',
      aircrafts.all(),
      {
        total: aircrafts.total,
        per_page: aircrafts.perPage,
        current_page: aircrafts.currentPage,
        last_page: aircrafts.lastPage,
        first_page: 1,
      }
    )

    return response.status(200).json(formattedResponse)
  }
  /**
   * @swagger
   * /api/aircraft:
   *   post:
   *     tags:
   *       - Aircraft
   *     summary: "Create a new aircraft"
   *     description: "Creates a new aircraft with the provided data."
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               aircraftRegistrationNumber:
   *                 type: string
   *               aircraftSerialNumber:
   *                 type: string
   *               airportId:
   *                 type: integer
   *               aircraftPropertiesId:
   *                 type: integer
   *               pilotPicId:
   *                 type: integer
   *               pilotSicId:
   *                 type: integer
   *               active:
   *                 type: integer
   *                 default: 1
   *     responses:
   *       201:
   *         description: "Successfully created aircraft"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Successfully action"
   *                 data:
   *                   type: object
   *                   properties:
   *                     aircraftId:
   *                       type: integer
   *                     aircraftRegistrationNumber:
   *                       type: string
   *                     aircraftSerialNumber:
   *                       type: string
   *                     airportId:
   *                       type: integer
   *                     aircraftPropertiesId:
   *                       type: integer
   *                     active:
   *                       type: integer
   *                     aircraftCreatedAt:
   *                       type: string
   *                       format: date-time
   *                     aircraftUpdatedAt:
   *                       type: string
   *                       format: date-time
   *                     aircraftDeletedAt:
   *                       type: string
   *                       format: date-time
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createAircraftValidator)
      const aircraft = await Aircraft.create(data)
      const pilotSicId = request.input('pilotSicId')
      const pilotPicId = request.input('pilotPicId')
      // 3. Relacionar pilotos (PIC y/o SIC) si se proporcionaron
      if (pilotPicId) {
        await aircraft.related('pilots').attach({
          [pilotPicId]: {
            aircraft_pilot_role: 'pic',
          },
        })
      }

      if (pilotSicId) {
        await aircraft.related('pilots').attach({
          [pilotSicId]: {
            aircraft_pilot_role: 'sic',
          },
        })
      }
      const aircraftResponse = await this.getAircraftWithPilots(aircraft.aircraftId)
      return response
        .status(201)
        .json(
          formatResponse('success', 'Successfully action', 'Resource created', aircraftResponse)
        )
    } catch (error) {
      return response
        .status(400)
        .json(
          formatResponse('error', 'Validation error', 'Invalid input, validation error 400', error)
        )
    }
  }

  async getAircraftWithPilots(aircraftId: number) {
    const aircraft = await Aircraft.query()
      .preload('pilots', (pilotsQuery) => {
        pilotsQuery.pivotColumns(['aircraft_pilot_role'])
      })
      .where('aircraftId', aircraftId)
      .whereNull('aircraftDeletedAt')
      .first()
    if (aircraft) {
      return aircraft.toJSON()
    }
    return null
  }
  /**
   * @swagger
   * /api/aircraft/{id}:
   *   get:
   *     tags:
   *       - Aircraft
   *     summary: "Retrieve a specific aircraft"
   *     description: "Fetches a single aircraft by its ID."
   *     parameters:
   *       - name: id
   *         in: path
   *         description: "ID of the aircraft to retrieve"
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: "Successfully fetched the aircraft"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Successfully fetched"
   *                 data:
   *                   type: object
   *                   properties:
   *                     aircraftId:
   *                       type: integer
   *                     aircraftRegistrationNumber:
   *                       type: string
   *                     aircraftSerialNumber:
   *                       type: string
   *                     airportId:
   *                       type: integer
   *                     aircraftPropertiesId:
   *                       type: integer
   *                     active:
   *                       type: integer
   *                     aircraftCreatedAt:
   *                       type: string
   *                       format: date-time
   *                     aircraftUpdatedAt:
   *                       type: string
   *                       format: date-time
   *                     aircraftDeletedAt:
   *                       type: string
   *                       format: date-time
   *       404:
   *         description: "Aircraft not found"
   */
  async show({ params, response }: HttpContext) {
    try {
      const aircraft = await Aircraft.query()
        .where('aircraftId', params.id)
        .preload('pilots', (pilotsQuery) => {
          pilotsQuery.pivotColumns(['aircraft_pilot_role'])
        })
        .whereNull('aircraftDeletedAt')
        .firstOrFail()
      return response
        .status(200)
        .json(
          formatResponse('success', 'Successfully fetched', 'Resource fetched', aircraft.toJSON())
        )
    } catch (error) {
      return response
        .status(404)
        .json(formatResponse('error', 'Not Found', 'Resource not found', 'NO DATA'))
    }
  }
  /**
   * @swagger
   * /api/aircraft/{id}:
   *   put:
   *     tags:
   *       - Aircraft
   *     summary: "Update an existing aircraft"
   *     description: "Updates the details of an existing aircraft by ID."
   *     parameters:
   *       - name: id
   *         in: path
   *         description: "ID of the aircraft to update"
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               aircraftRegistrationNumber:
   *                 type: string
   *               aircraftSerialNumber:
   *                 type: string
   *               airportId:
   *                 type: integer
   *               pilotPicId:
   *                 type: integer
   *               pilotSicId:
   *                 type: integer
   *               aircraftPropertiesId:
   *                 type: integer
   *               active:
   *                 type: integer
   *     responses:
   *       200:
   *         description: "Successfully updated the aircraft"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Successfully action"
   *                 data:
   *                   type: object
   *                   properties:
   *                     aircraftId:
   *                       type: integer
   *                     aircraftRegistrationNumber:
   *                       type: string
   *                     aircraftSerialNumber:
   *                       type: string
   *                     airportId:
   *                       type: integer
   *                     aircraftPropertiesId:
   *                       type: integer
   *                     active:
   *                       type: integer
   *                     aircraftCreatedAt:
   *                       type: string
   *                       format: date-time
   *                     aircraftUpdatedAt:
   *                       type: string
   *                       format: date-time
   *                     aircraftDeletedAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: "Validation error"
   *       404:
   *         description: "Aircraft not found"
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateAircraftValidator)
      const aircraft = await Aircraft.findOrFail(params.id)
      aircraft.merge(data)
      await aircraft.save()
      const pilotSicId = request.input('pilotSicId')
      const pilotPicId = request.input('pilotPicId')

      if (typeof pilotPicId !== 'undefined') {
        // Eliminar cualquier relación previa con rol = pic
        await Database.from('aircraft_pilots')
          .where('aircraft_id', aircraft.aircraftId)
          .where('aircraft_pilot_role', 'pic')
          .delete()

        // Si no es null, agregamos el nuevo PIC
        if (pilotPicId !== null) {
          await aircraft.related('pilots').attach({
            [pilotPicId]: {
              aircraft_pilot_role: 'pic',
            },
          })
        }
      }

      if (typeof pilotSicId !== 'undefined') {
        // Eliminar cualquier relación previa con rol = sic
        await Database.from('aircraft_pilots')
          .where('aircraft_id', aircraft.aircraftId)
          .where('aircraft_pilot_role', 'sic')
          .delete()

        // Si no es null, agregamos el nuevo SIC
        if (pilotSicId !== null) {
          await aircraft.related('pilots').attach({
            [pilotSicId]: {
              aircraft_pilot_role: 'sic',
            },
          })
        }
      }
      const aircraftResponse = await this.getAircraftWithPilots(aircraft.aircraftId)
      return response
        .status(200)
        .json(
          formatResponse('success', 'Successfully action', 'Resource updated', aircraftResponse)
        )
    } catch (error) {
      console.error('Update Aircraft Error:', error)

      const errorResponse = {
        message: 'Validation error',
        details: error?.message || 'Unknown error',
        ...(error?.messages ? { messages: error.messages } : {}),
      }
      return response
        .status(400)
        .json(
          formatResponse(
            'error',
            'Validation error',
            'Invalid input, validation error 400',
            errorResponse
          )
        )
    }
  }
  /**
   * @swagger
   * /api/aircraft/{id}:
   *   delete:
   *     tags:
   *       - Aircraft
   *     summary: "Delete an aircraft"
   *     description: "Marks an aircraft as deleted by setting the deletion timestamp."
   *     parameters:
   *       - name: id
   *         in: path
   *         description: "ID of the aircraft to delete"
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: "Successfully deleted the aircraft"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Successfully deleted"
   *       404:
   *         description: "Aircraft not found"
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const aircraft = await Aircraft.findOrFail(params.id)
      aircraft.aircraftDeletedAt = DateTime.now()
      await aircraft.save()
      return response
        .status(200)
        .json(formatResponse('success', 'Successfully deleted', 'Resource deleted', 'NO CONTENT'))
    } catch (error) {
      return response
        .status(404)
        .json(formatResponse('error', 'Not Found', 'Resource not found', 'NO DATA'))
    }
  }
}
