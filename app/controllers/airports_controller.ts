import { HttpContext } from '@adonisjs/core/http'
import Airport from '../models/airport.js'
import { createAirportValidator, updateAirportValidator } from '../validators/airport.js'
import { formatResponse } from '../helpers/responseFormatter.js'
import { DateTime } from 'luxon'
import AWS, { S3 } from 'aws-sdk'
import fs from 'node:fs'
import Env from '#start/env'

export default class AirportController {
  private s3Config: AWS.S3.ClientConfiguration = {
    accessKeyId: Env.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY'),
    endpoint: Env.get('AWS_ENDPOINT'),
    s3ForcePathStyle: true, // Necesario para espacios de DigitalOcean
  }
  private BUCKET_NAME = Env.get('AWS_BUCKET')
  private APP_NAME = `${Env.get('AWS_ROOT_PATH')}/`

  constructor() {
    AWS.config.update(this.s3Config)
  }

  async fileUpload(
    file: any,
    folderName = '',
    fileName = '',
    permission = 'public-read'
  ): Promise<string> {
    try {
      if (!file) {
        return 'file_not_found'
      }

      const s3 = new AWS.S3()
      const fileContent = fs.createReadStream(file.tmpPath)

      const timestamp = new Date().getTime()
      const randomValue = Math.random().toFixed(10).toString().replace('.', '')
      const fileNameGenerated = fileName || `T${timestamp}R${randomValue}.${file.extname}`

      const uploadParams = {
        Bucket: this.BUCKET_NAME,
        Key: `${this.APP_NAME}${folderName || 'files'}/${fileNameGenerated}`,
        Body: fileContent,
        ACL: permission,
        ContentType: `${file.type}/${file.subtype}`,
      } as S3.Types.PutObjectRequest

      const response = await s3.upload(uploadParams).promise()
      return response.Location
    } catch (err) {
      return 'S3Producer.fileUpload'
    }
  }

  /**
   * @swagger
   * /api/airports:
   *   get:
   *     tags:
   *       - Airports
   *     summary: Get all airports
   *     responses:
   *       '200':
   *         description: Airports fetched successfully
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
   *                           airportId:
   *                             type: number
   *                           airportType:
   *                             type: string
   *                           airportName:
   *                             type: string
   *                           airportLatitudeDeg:
   *                             type: number
   *                           airportLongitudeDeg:
   *                             type: number
   *                           airportElevationFt:
   *                             type: number
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const searchText = request.input('searchText', '')

    const query = Airport.query().whereNull('airportDeletedAt')

    if (searchText) {
      query.where((builder) => {
        builder.where('airportName', 'like', `%${searchText}%`)
      })
    }
    const airports = await query.paginate(page, limit)

    const formattedResponse = formatResponse(
      'success',
      'Successfully fetched',
      'Resources fetched',
      airports.all(),
      {
        total: airports.total,
        per_page: airports.perPage,
        current_page: airports.currentPage,
        last_page: airports.lastPage,
        first_page: 1,
      }
    )

    return response.status(200).json(formattedResponse)
  }

  /**
   * @swagger
   * /api/airports:
   *   post:
   *     tags:
   *       - Airports
   *     summary: Create a new airport
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               airportType:
   *                 type: string
   *                 enum: [heliport, small_airport, seaplane_base, balloonport, medium_airport, large_airport]
   *               airportName:
   *                 type: string
   *               airportLatitudeDeg:
   *                 type: number
   *               airportLongitudeDeg:
   *                 type: number
   *               airportElevationFt:
   *                 type: number
   *     responses:
   *       '201':
   *         description: Airport created successfully
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
   *                     airportId:
   *                       type: number
   *                     airportType:
   *                       type: string
   *                     airportName:
   *                       type: string
   *                     airportLatitudeDeg:
   *                       type: number
   *                     airportLongitudeDeg:
   *                       type: number
   *                     airportElevationFt:
   *                       type: number
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
      const data = await request.validateUsing(createAirportValidator)

      const airport = await Airport.create(data)
      return response
        .status(201)
        .json(
          formatResponse('success', 'Successfully action', 'Resource created', airport.toJSON())
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
   * /api/airports/{id}:
   *   get:
   *     tags:
   *       - Airports
   *     summary: Get a specific airport
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Airport fetched successfully
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
   *                     airportId:
   *                       type: number
   *                     airportType:
   *                       type: string
   *                     airportName:
   *                       type: string
   *                     airportLatitudeDeg:
   *                       type: number
   *                     airportLongitudeDeg:
   *                       type: number
   *                     airportElevationFt:
   *                       type: number
   *       '404':
   *         description: Airport not found
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
      const airport = await Airport.query()
        .where('airportId', params.id)
        .whereNull('airportDeletedAt')
        .firstOrFail()

      return response
        .status(200)
        .json(
          formatResponse('success', 'Successfully action', 'Resource fetched', airport.toJSON())
        )
    } catch (error) {
      return response
        .status(404)
        .json(formatResponse('error', 'Resource not found', 'Airport not found', error))
    }
  }

  /**
   * @swagger
   * /api/airports/{id}:
   *   put:
   *     tags:
   *       - Airports
   *     summary: Update a specific airport
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
   *               airportType:
   *                 type: string
   *                 enum: [heliport, small_airport, seaplane_base, balloonport, medium_airport, large_airport]
   *               airportName:
   *                 type: string
   *               airportLatitudeDeg:
   *                 type: number
   *               airportLongitudeDeg:
   *                 type: number
   *               airportElevationFt:
   *                 type: number
   *     responses:
   *       '200':
   *         description: Airport updated successfully
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
   *                     airportId:
   *                       type: number
   *                     airportType:
   *                       type: string
   *                     airportName:
   *                       type: string
   *                     airportLatitudeDeg:
   *                       type: number
   *                     airportLongitudeDeg:
   *                       type: number
   *                     airportElevationFt:
   *                       type: number
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
   *       '404':
   *         description: Airport not found
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
      const data = await request.validateUsing(updateAirportValidator)
      const airport = await Airport.query()
        .where('airportId', params.id)
        .whereNull('airportDeletedAt')
        .firstOrFail()

      airport.merge(data)
      await airport.save()

      return response
        .status(200)
        .json(
          formatResponse('success', 'Successfully action', 'Resource updated', airport.toJSON())
        )
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response
          .status(404)
          .json(formatResponse('error', 'Resource not found', 'Airport not found', error))
      }
      return response
        .status(400)
        .json(
          formatResponse('error', 'Validation error', 'Invalid input, validation error 400', error)
        )
    }
  }

  /**
   * @swagger
   * /api/airports/{id}:
   *   delete:
   *     tags:
   *       - Airports
   *     summary: Delete a specific airport
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '204':
   *         description: Airport deleted successfully
   *       '404':
   *         description: Airport not found
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
      const airport = await Airport.query()
        .where('airportId', params.id)
        .whereNull('airportDeletedAt')
        .firstOrFail()

      airport.merge({ airportDeletedAt: DateTime.local() })
      await airport.save()

      return response
        .status(200)
        .json(formatResponse('success', 'Successfully action', 'Resource deleted', {}))
    } catch (error) {
      return response
        .status(404)
        .json(formatResponse('error', 'Resource not found', 'Airport not found', error))
    }
  }
}
