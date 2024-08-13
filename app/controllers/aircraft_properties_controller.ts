import type { HttpContext } from '@adonisjs/core/http'
import { formatResponse } from '../helpers/responseFormatter.js'
import AircraftProperty from '../models/aircraft_property.js'
import {
  createAircraftPropertyValidator,
  updateAircraftPropertyValidator,
} from '../validators/aircraft_property.js'
import { DateTime } from 'luxon'
import AWS, { S3 } from 'aws-sdk'
import fs from 'node:fs'
import Env from '#start/env'

export default class AircraftPropertiesController {
  /**
   * @swagger
   * /api/aircraft-properties:
   *   get:
   *     tags:
   *       - Aircraft Properties
   *     summary: Get all aircraft properties
   *     responses:
   *       '200':
   *         description: Aircraft properties fetched successfully
   */
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
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const searchText = request.input('searchText', '')

    const query = AircraftProperty.query()
      .whereNull('aircraftPropertiesDeletedAt')
      .preload('aircraftClass', (aircraftClassQuery) => {
        aircraftClassQuery.select('aircraftClassBanner')
      })
    if (searchText) {
      query.where((builder) => {
        builder.where('aircraftPropertiesName', 'like', `%${searchText}%`)
      })
    }
    const properties = await query.paginate(page, limit)

    const formattedResponse = formatResponse(
      'success',
      'Successfully fetched',
      'Resources fetched',
      properties.all(),
      {
        total: properties.total,
        per_page: properties.perPage,
        current_page: properties.currentPage,
        last_page: properties.lastPage,
        first_page: 1,
      }
    )

    return response.status(200).json(formattedResponse)
  }

  /**
   * @swagger
   * /api/aircraft-properties:
   *   post:
   *     tags:
   *       - Aircraft Properties
   *     summary: Create a new aircraft property
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               aircraftPropertyName:
   *                 type: string
   *               aircraftClassId:
   *                 type: number
   *               aircraftPropertyPax:
   *                 type: number
   *               aircraftPropertySpeed:
   *                 type: number
   *               aircraftPropertyMaxKg:
   *                 type: number
   *               aircraftPropertyAutonomy:
   *                 type: number
   *               aircraftPropertyAutonomyHours:
   *                 type: number
   *               aircraftPropertyLandingCostNational:
   *                 type: number
   *               aircraftPropertyOvernightStayInternational:
   *                 type: number
   *     responses:
   *       '201':
   *         description: Aircraft property created successfully
   *       '400':
   *         description: Invalid input, validation error
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createAircraftPropertyValidator)

      const aircraftProperty = await AircraftProperty.create(data)

      const bannerFile = request.file('aircraftPropertyBanner')
      if (bannerFile) {
        const bannerUrl = await this.fileUpload(bannerFile)
        if (bannerUrl !== 'file_not_found' && bannerUrl !== 'S3Producer.fileUpload') {
          await aircraftProperty.load('aircraftClass')
          if (aircraftProperty.aircraftClass) {
            aircraftProperty.aircraftClass.merge({ aircraftClassBanner: bannerUrl })
            await aircraftProperty.aircraftClass.save()
          } else {
            return response
              .status(404)
              .json(formatResponse('error', 'Not found', 'Aircraft class not found', response))
          }
        } else {
          return response
            .status(500)
            .json(formatResponse('error', 'Upload error', 'Failed to upload file to S3', bannerUrl))
        }
      }
      await aircraftProperty.load('aircraftClass', (aircraftClassQuery) => {
        aircraftClassQuery.select('aircraftClassBanner')
      })
      return response
        .status(201)
        .json(
          formatResponse(
            'success',
            'Successfully action',
            'Resource created',
            aircraftProperty.toJSON()
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
   * /api/aircraft-properties/{id}:
   *   get:
   *     tags:
   *       - Aircraft Properties
   *     summary: Get a specific aircraft property
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Aircraft property fetched successfully
   *       '404':
   *         description: Aircraft property not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const aircraftProperty = await AircraftProperty.query()
        .where('aircraftPropertiesId', params.id)
        .whereNull('aircraftPropertiesDeletedAt')
        .firstOrFail()
      return response
        .status(200)
        .json(
          formatResponse(
            'success',
            'Successfully fetched',
            'Resource fetched',
            aircraftProperty.toJSON()
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
   * /api/aircraft-properties/{id}:
   *   put:
   *     tags:
   *       - Aircraft Properties
   *     summary: Update a specific aircraft property
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
   *               aircraftPropertyName:
   *                 type: string
   *               aircraftClassId:
   *                 type: number
   *               aircraftPropertyPax:
   *                 type: number
   *               aircraftPropertySpeed:
   *                 type: number
   *               aircraftPropertyMaxKg:
   *                 type: number
   *               aircraftPropertyAutonomy:
   *                 type: number
   *               aircraftPropertyAutonomyHours:
   *                 type: number
   *               aircraftPropertyLandingCostNational:
   *                 type: number
   *               aircraftPropertyOvernightStayInternational:
   *                 type: number
   *     responses:
   *       '200':
   *         description: Aircraft property updated successfully
   *       '404':
   *         description: Aircraft property not found
   *       '400':
   *         description: Invalid input, validation error
   */
  async update({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(updateAircraftPropertyValidator)
      const aircraftProperty = await AircraftProperty.findOrFail(params.id)
      const bannerFile = request.file('aircraftPropertyBanner')
      if (bannerFile) {
        const bannerUrl = await this.fileUpload(bannerFile)
        if (bannerUrl !== 'file_not_found' && bannerUrl !== 'S3Producer.fileUpload') {
          await aircraftProperty.load('aircraftClass')
          if (aircraftProperty.aircraftClass) {
            aircraftProperty.aircraftClass.merge({ aircraftClassBanner: bannerUrl })
            await aircraftProperty.aircraftClass.save()
          } else {
            return response
              .status(404)
              .json(formatResponse('error', 'Not found', 'Aircraft class not found', response))
          }
        } else {
          return response
            .status(500)
            .json(formatResponse('error', 'Upload error', 'Failed to upload file to S3', bannerUrl))
        }
      }
      await aircraftProperty.load('aircraftClass', (aircraftClassQuery) => {
        aircraftClassQuery.select('aircraftClassBanner')
      })
      return response
        .status(200)
        .json(
          formatResponse(
            'success',
            'Successfully action',
            'Resource updated',
            aircraftProperty.toJSON()
          )
        )
    } catch (error) {
      console.error('Error updating aircraft property:', error)
      return response
        .status(400)
        .json(
          formatResponse(
            'error',
            'Validation error',
            'Invalid input, validation error 400 ',
            error.messages || error
          )
        )
    }
  }

  /**
   * @swagger
   * /api/aircraft-properties/{id}:
   *   delete:
   *     tags:
   *       - Aircraft Properties
   *     summary: Delete a specific aircraft property
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '204':
   *         description: Aircraft property deleted successfully
   *       '404':
   *         description: Aircraft property not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const aircraftProperty = await AircraftProperty.findOrFail(params.id)
      aircraftProperty.aircraftPropertiesDeletedAt = DateTime.now()
      await aircraftProperty.save()
      return response
        .status(200)
        .json(formatResponse('success', 'Successfully action', 'Resource deleted', {}))
    } catch (error) {
      return response
        .status(404)
        .json(formatResponse('error', 'Not Found', 'Resource not found', 'NO DATA'))
    }
  }
}
