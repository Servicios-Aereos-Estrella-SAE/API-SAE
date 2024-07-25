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
   * /api/vacation-settings:
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
   *                           id:
   *                             type: number
   *                           yearsOfService:
   *                             type: number
   *                           vacationDays:
   *                             type: number
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const settings = await VacationSetting.query().whereNull('deletedAt').paginate(page, limit)

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
   * /api/vacation-settings:
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
   *               yearsOfService:
   *                 type: number
   *               vacationDays:
   *                 type: number
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
   *                     id:
   *                       type: number
   *                     yearsOfService:
   *                       type: number
   *                     vacationDays:
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
      const data = await request.validateUsing(createVacationSettingValidator)
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
   * /api/vacation-settings/{id}:
   *   get:
   *     tags:
   *       - Vacation Settings
   *     summary: Get a specific vacation setting
   *     parameters:
   *       - name: id
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
   *                     id:
   *                       type: number
   *                     yearsOfService:
   *                       type: number
   *                     vacationDays:
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
      const vacationSetting = await VacationSetting.findOrFail(params.id)
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
   * /api/vacation-settings/{id}:
   *   put:
   *     tags:
   *       - Vacation Settings
   *     summary: Update a specific vacation setting
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
   *               yearsOfService:
   *                 type: number
   *               vacationDays:
   *                 type: number
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
   *                     id:
   *                       type: number
   *                     yearsOfService:
   *                       type: number
   *                     vacationDays:
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
      const data = await request.validateUsing(updateVacationSettingValidator)
      const vacationSetting = await VacationSetting.findOrFail(params.id)
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
   * /api/vacation-settings/{id}:
   *   delete:
   *     tags:
   *       - Vacation Settings
   *     summary: Delete a specific vacation setting
   *     parameters:
   *       - name: id
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
      const vacationSetting = await VacationSetting.findOrFail(params.id)
      vacationSetting.deletedAt = DateTime.now()
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
