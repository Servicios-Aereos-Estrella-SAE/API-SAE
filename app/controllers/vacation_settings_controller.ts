import { HttpContext } from '@adonisjs/core/http'
import VacationSetting from '../models/vacation_setting.js'
import {
  createVacationSettingValidator,
  updateVacationSettingValidator,
} from '../validators/vacations.js'
import { formatResponse } from '../helpers/responseFormatter.js'
import { DateTime } from 'luxon'

export default class VacationSettingController {
  /**
   * @swagger
   * /api/vacations:
   *   get:
   *     tags:
   *       - Vacation Settings
   *     summary: Get all vacation settings
   *     responses:
   *       '200':
   *         description: Vacation settings fetched successfully
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
   *                           vacationSettingId:
   *                             type: number
   *                           vacationSettingYearsOfService:
   *                             type: number
   *                           vacationSettingVacationDays:
   *                             type: number
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const searchText = request.input('searchText', '')

    const query = VacationSetting.query().whereNull('vacationSettingDeletedAt')

    if (searchText) {
      query.where((builder) => {
        builder.where('vacationSettingYearsOfService', `${searchText}`)
      })
    }
    const settings = await query.paginate(page, limit)

    const formattedResponse = formatResponse(
      'success',
      'Successfully fetched',
      'Resources fetched',
      settings.all(),
      {
        total: settings.total,
        per_page: settings.perPage,
        current_page: settings.currentPage,
        last_page: settings.lastPage,
        first_page: 1,
      }
    )

    return response.status(200).json(formattedResponse)
  }

  /**
   * @swagger
   * /api/vacations:
   *   post:
   *     tags:
   *       - Vacation Settings
   *     summary: Create a new vacation setting
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               vacationSettingYearsOfService:
   *                 type: number
   *               vacationSettingVacationDays:
   *                 type: number
   *               vacationSettingApplySince:
   *                 type: string
   *                 format: date
   *                 description: Apply since (YYYY-MM-DD)
   *                 required: true
   *                 default: ''
   *     responses:
   *       '201':
   *         description: Vacation setting created successfully
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
   *                     vacationSettingId:
   *                       type: number
   *                     vacationSettingYearsOfService:
   *                       type: number
   *                     vacationSettingVacationDays:
   *                       type: number
   *                     vacationSettingApplySince:
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
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createVacationSettingValidator)
      data.vacationSettingApplySince = data.vacationSettingApplySince
        ? DateTime.fromJSDate(new Date(data.vacationSettingApplySince)).setZone('UTC').toJSDate()
        : data.vacationSettingApplySince
      const vacationSetting = await VacationSetting.create(data)
      return response
        .status(201)
        .json(
          formatResponse(
            'success',
            'Successfully action',
            'Resource created',
            vacationSetting.toJSON()
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
   * /api/vacations/{vacationSettingId}:
   *   get:
   *     tags:
   *       - Vacation Settings
   *     summary: Get a specific vacation setting
   *     parameters:
   *       - name: vacationSettingId
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Vacation setting fetched successfully
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
   *                     vacationSettingId:
   *                       type: number
   *                     vacationSettingYearsOfService:
   *                       type: number
   *                     vacationSettingVacationDays:
   *                       type: number
   *       '404':
   *         description: Vacation setting not found
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
      const vacationSetting = await VacationSetting.findOrFail(params.vacationSettingId)
      return response
        .status(200)
        .json(
          formatResponse(
            'success',
            'Successfully fetched',
            'Resource fetched',
            vacationSetting.toJSON()
          )
        )
    } catch (error) {
      return response
        .status(404)
        .json(formatResponse('error', 'Not Found', 'Resource not found', error))
    }
  }

  /**
   * @swagger
   * /api/vacations/{vacationSettingId}:
   *   put:
   *     tags:
   *       - Vacation Settings
   *     summary: Update a specific vacation setting
   *     parameters:
   *       - name: vacationSettingId
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
   *               vacationSettingYearsOfService:
   *                 type: number
   *               vacationSettingVacationDays:
   *                 type: number
   *               vacationSettingApplySince:
   *                 type: string
   *                 format: date
   *                 description: Apply since (YYYY-MM-DD)
   *                 required: true
   *                 default: ''
   *     responses:
   *       '200':
   *         description: Vacation setting updated successfully
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
   *                     vacationSettingId:
   *                       type: number
   *                     vacationSettingYearsOfService:
   *                       type: number
   *                     vacationSettingVacationDays:
   *                       type: number
   *                     vacationSettingApplySince:
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
   *       '404':
   *         description: Vacation setting not found
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
      const vacationSettingId = params.vacationSettingId
      const requestData = request.all()
      const mergedData = { ...requestData, vacationSettingId }
      const data = await updateVacationSettingValidator.validate(mergedData)
      data.vacationSettingApplySince = data.vacationSettingApplySince
        ? DateTime.fromJSDate(new Date(data.vacationSettingApplySince)).setZone('UTC').toJSDate()
        : data.vacationSettingApplySince
      const vacationSetting = await VacationSetting.findOrFail(params.vacationSettingId)
      vacationSetting.merge(data)
      await vacationSetting.save()

      return response
        .status(200)
        .json(
          formatResponse(
            'success',
            'Successfully updated',
            'Resource updated',
            vacationSetting.toJSON()
          )
        )
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response
          .status(404)
          .json(formatResponse('error', 'Not Found', 'Resource not found', error))
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
   * /api/vacations/{vacationSettingId}:
   *   delete:
   *     tags:
   *       - Vacation Settings
   *     summary: Delete a specific vacation setting
   *     parameters:
   *       - name: vacationSettingId
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Vacation setting deleted successfully
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
   *       '404':
   *         description: Vacation setting not found
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
      const vacationSetting = await VacationSetting.findOrFail(params.vacationSettingId)
      vacationSetting.vacationSettingDeletedAt = DateTime.now()
      await vacationSetting.save()

      return response
        .status(200)
        .json(formatResponse('success', 'Successfully deleted', 'Resource deleted', null))
    } catch (error) {
      return response
        .status(404)
        .json(formatResponse('error', 'Not Found', 'Resource not found', error.messages || error))
    }
  }
}
