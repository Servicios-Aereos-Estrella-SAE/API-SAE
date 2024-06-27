import Holiday from '../models/holiday.js'
import { createOrUpdateHolidayValidator } from '../validators/holiday.js'
import { HttpContext } from '@adonisjs/core/http'

/**
 * @swagger
 * tags:
 *   name: Holiday
 *   description: Holiday management
 */

export default class HolidayController {
  /**
   * @swagger
   * /holidays:
   *   get:
   *     tags: [Holiday]
   *     summary: Get all holidays
   *     description: Retrieve a list of all holidays.
   *     responses:
   *       200:
   *         description: Successfully fetched resources
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   example: success
   *                 title:
   *                   type: string
   *                   example: Successfully action
   *                 message:
   *                   type: string
   *                   example: Resources fetched
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Holiday'
   *       500:
   *         description: Server error
   */
  async index({ response }: HttpContext) {
    try {
      const holidays = await Holiday.all()

      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resources fetched',
        data: holidays,
      })
    } catch (error) {
      return response.status(500).json({
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error occurred',
        data: null,
      })
    }
  }

  /**
   * @swagger
   * /holidays:
   *   post:
   *     tags: [Holiday]
   *     summary: Create a new holiday
   *     description: Create a new holiday.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Holiday'
   *     responses:
   *       201:
   *         description: Resource created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   example: success
   *                 title:
   *                   type: string
   *                   example: Successfully action
   *                 message:
   *                   type: string
   *                   example: Resource created
   *                 data:
   *                   $ref: '#/components/schemas/Holiday'
   *       400:
   *         description: Validation error
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createOrUpdateHolidayValidator)
      const holiday = await Holiday.create(data)

      return response.status(201).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource created',
        data: holiday.toJSON(),
      })
    } catch (error) {
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: error.messages,
        data: error,
      })
    }
  }

  /**
   * @swagger
   * /holidays/{id}:
   *   get:
   *     tags: [Holiday]
   *     summary: Get a holiday by ID
   *     description: Retrieve a single holiday by its ID.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the holiday to retrieve
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Successfully fetched resource
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   example: success
   *                 title:
   *                   type: string
   *                   example: Successfully action
   *                 message:
   *                   type: string
   *                   example: Resource fetched
   *                 data:
   *                   $ref: '#/components/schemas/Holiday'
   *       404:
   *         description: Resource not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const holiday = await Holiday.findOrFail(params.id)

      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource fetched',
        data: holiday,
      })
    } catch (error) {
      return response.status(404).json({
        type: 'error',
        title: 'Not found',
        message: 'Resource not found',
        data: null,
      })
    }
  }

  /**
   * @swagger
   * /holidays/{id}:
   *   put:
   *     tags: [Holiday]
   *     summary: Update a holiday
   *     description: Update an existing holiday by its ID.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the holiday to update
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Holiday'
   *     responses:
   *       200:
   *         description: Resource updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   example: success
   *                 title:
   *                   type: string
   *                   example: Successfully action
   *                 message:
   *                   type: string
   *                   example: Resource updated
   *                 data:
   *                   $ref: '#/components/schemas/Holiday'
   *       400:
   *         description: Validation error
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createOrUpdateHolidayValidator)
      const holiday = await Holiday.findOrFail(params.id)

      holiday.merge(data)
      await holiday.save()

      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource updated',
        data: holiday.toJSON(),
      })
    } catch (error) {
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: error.messages,
        data: error,
      })
    }
  }

  /**
   * @swagger
   * /holidays/{id}:
   *   delete:
   *     tags: [Holiday]
   *     summary: Delete a holiday
   *     description: Delete an existing holiday by its ID.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the holiday to delete
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Resource deleted
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   example: success
   *                 title:
   *                   type: string
   *                   example: Successfully action
   *                 message:
   *                   type: string
   *                   example: Resource deleted
   *                 data:
   *                   $ref: '#/components/schemas/Holiday'
   *       404:
   *         description: Resource not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const holiday = await Holiday.findOrFail(params.id)
      await holiday.delete()

      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource deleted',
        data: holiday.toJSON(),
      })
    } catch (error) {
      return response.status(404).json({
        type: 'error',
        title: 'Not found',
        message: 'Resource not found',
        data: null,
      })
    }
  }
}
