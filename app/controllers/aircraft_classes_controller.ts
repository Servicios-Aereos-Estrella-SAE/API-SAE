import { HttpContext } from '@adonisjs/core/http'
import AircraftClass from '../models/aircraft_class.js'
import {
  createAircraftClassValidator,
  updateAircraftClassValidator,
} from '../validators/aircraft_class.js'
import { formatResponse } from '../helpers/responseFormatter.js'
import { DateTime } from 'luxon'

function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default class AircraftClassController {
  /**
   * @swagger
   * /api/aircraft-classes:
   *   get:
   *     tags:
   *       - Aircraft Classes
   *     summary: Get all aircraft classes
   *     responses:
   *       '200':
   *         description: Aircraft classes fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     meta:
   *                       type: object
   *                       properties:
   *                         total:
   *                           type: number
   *                         per_page:
   *                           type: number
   *                         current_page:
   *                           type: number
   *                         last_page:
   *                           type: number
   *                         first_page:
   *                           type: number
   *                     data:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: number
   *                           aircraftClassName:
   *                             type: string
   *                           aircraftClassShortDescription:
   *                             type: string
   *                           aircraftClassLongDescription:
   *                             type: string
   *                           aircraftClassBanner:
   *                             type: string
   *                           aircraftClassSlug:
   *                             type: string
   *                           aircraftClassStatus:
   *                             type: boolean
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const searchText = request.input('searchText', '')

    const query = AircraftClass.query().whereNull('aircraftClassDeletedAt')

    if (searchText) {
      query.where((builder) => {
        builder.where('aircraftClassName', 'like', `%${searchText}%`)
      })
    }
    const classes = await query.paginate(page, limit)

    const formattedResponse = formatResponse(
      'success',
      'Successfully fetched',
      'Resources fetched',
      classes.all(),
      {
        total: classes.total,
        per_page: classes.perPage,
        current_page: classes.currentPage,
        last_page: classes.lastPage,
        first_page: 1,
      }
    )

    return response.status(200).json(formattedResponse)
  }

  /**
   * @swagger
   * /api/aircraft-classes:
   *   post:
   *     tags:
   *       - Aircraft Classes
   *     summary: Create a new aircraft class
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               aircraftClassName:
   *                 type: string
   *               aircraftClassShortDescription:
   *                 type: string
   *               aircraftClassLongDescription:
   *                 type: string
   *               aircraftClassBanner:
   *                 type: string
   *               aircraftClassSlug:
   *                 type: string
   *               aircraftClassStatus:
   *                 type: boolean
   *     responses:
   *       '201':
   *         description: Aircraft class created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     aircraftClassName:
   *                       type: string
   *                     aircraftClassShortDescription:
   *                       type: string
   *                     aircraftClassLongDescription:
   *                       type: string
   *                     aircraftClassBanner:
   *                       type: string
   *                     aircraftClassSlug:
   *                       type: string
   *                     aircraftClassStatus:
   *                       type: boolean
   *       '400':
   *         description: Invalid input, validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   */

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createAircraftClassValidator)

      // Generar el slug antes de guardar
      data.aircraftClassSlug = generateSlug(data.aircraftClassName)

      const aircraftClass = await AircraftClass.create(data)
      return response
        .status(201)
        .json(
          formatResponse(
            'success',
            'Successfully action',
            'Resource created',
            aircraftClass.toJSON()
          )
        )
    } catch (error) {
      return response
        .status(400)
        .json(
          formatResponse('error', 'Validation error', 'Invalid input, validation error 400', error)
        )
    }
  }

  /**
   * @swagger
   * /api/aircraft-classes/{id}:
   *   get:
   *     tags:
   *       - Aircraft Classes
   *     summary: Get a specific aircraft class
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Aircraft class fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     aircraftClassName:
   *                       type: string
   *                     aircraftClassShortDescription:
   *                       type: string
   *                     aircraftClassLongDescription:
   *                       type: string
   *                     aircraftClassBanner:
   *                       type: string
   *                     aircraftClassSlug:
   *                       type: string
   *                     aircraftClassStatus:
   *                       type: boolean
   *       '404':
   *         description: Aircraft class not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   */
  async show({ params, response }: HttpContext) {
    try {
      const aircraftClass = await AircraftClass.query()
        .where('aircraftClassId', params.id)
        .whereNull('aircraftClassDeletedAt')
        .firstOrFail()
      return response
        .status(200)
        .json(
          formatResponse(
            'success',
            'Successfully fetched',
            'Resource fetched',
            aircraftClass.toJSON()
          )
        )
    } catch (error) {
      return response
        .status(404)
        .json(formatResponse('error', 'Not Found', 'Resource not found', 'NO DATA'))
    }
  }

  /**
   * @swagger
   * /api/aircraft-classes/{id}:
   *   put:
   *     tags:
   *       - Aircraft Classes
   *     summary: Update a specific aircraft class
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               aircraftClassName:
   *                 type: string
   *               aircraftClassShortDescription:
   *                 type: string
   *               aircraftClassLongDescription:
   *                 type: string
   *               aircraftClassBanner:
   *                 type: string
   *               aircraftClassSlug:
   *                 type: string
   *               aircraftClassStatus:
   *                 type: boolean
   *     responses:
   *       '200':
   *         description: Aircraft class updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     aircraftClassName:
   *                       type: string
   *                     aircraftClassShortDescription:
   *                       type: string
   *                     aircraftClassLongDescription:
   *                       type: string
   *                     aircraftClassBanner:
   *                       type: string
   *                     aircraftClassSlug:
   *                       type: string
   *                     aircraftClassStatus:
   *                       type: boolean
   *       '404':
   *         description: Aircraft class not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *       '400':
   *         description: Invalid input, validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateAircraftClassValidator)

      const aircraftClass = await AircraftClass.findOrFail(params.id)

      // Regenerar el slug si se actualiza el aircraftClassName
      if (data.aircraftClassName) {
        data.aircraftClassSlug = generateSlug(data.aircraftClassName)
      }

      aircraftClass.merge(data)
      await aircraftClass.save()

      return response
        .status(200)
        .json(
          formatResponse(
            'success',
            'Successfully action',
            'Resource updated',
            aircraftClass.toJSON()
          )
        )
    } catch (error) {
      return response
        .status(400)
        .json(
          formatResponse('error', 'Validation error', 'Invalid input, validation error 400', error)
        )
    }
  }

  /**
   * @swagger
   * /api/aircraft-classes/{id}:
   *   delete:
   *     tags:
   *       - Aircraft Classes
   *     summary: Delete a specific aircraft class
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Aircraft class deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *       '404':
   *         description: Aircraft class not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const aircraftClass = await AircraftClass.findOrFail(params.id)
      aircraftClass.aircraftClassDeletedAt = DateTime.now()
      await aircraftClass.save()
      return response
        .status(200)
        .json(formatResponse('success', 'Successfully action', 'Resource deleted', {}))
    } catch (error) {
      return response
        .status(404)
        .json(formatResponse('error', 'Not Found', 'Resource not found', error))
    }
  }
}
