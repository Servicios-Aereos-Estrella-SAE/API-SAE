import ShiftException from '../models/shift_exception.js'
import { createShiftExceptionValidator } from '../validators/shift_exception.js'
import { HttpContext } from '@adonisjs/core/http'

export default class ShiftExceptionController {
  /**
   * @swagger
   * /shift-exception:
   *   get:
   *     summary: Retrieve a list of shift exceptions
   *     tags: [ShiftException]
   *     responses:
   *       200:
   *         description: A list of shift exceptions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/ShiftException'
   *       500:
   *         description: Server error
   */
  async index({ response }: HttpContext) {
    try {
      const shiftExceptions = await ShiftException.all()
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resources fetched',
        data: shiftExceptions,
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
   * /shift-exception:
   *   post:
   *     summary: Create a new shift exception
   *     tags: [ShiftException]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ShiftException'
   *     responses:
   *       201:
   *         description: Shift exception created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShiftException'
   *       400:
   *         description: Validation error
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createShiftExceptionValidator)
      const shiftException = await ShiftException.create(data)
      return response.status(201).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource created',
        data: shiftException.toJSON(),
      })
    } catch (error) {
      console.error('Error:', error)
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
   * /shift-exception/{id}:
   *   get:
   *     summary: Get a shift exception by ID
   *     tags: [ShiftException]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID of the shift exception to retrieve
   *     responses:
   *       200:
   *         description: Shift exception fetched
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShiftException'
   *       404:
   *         description: Shift exception not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const shiftException = await ShiftException.findOrFail(params.id)
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource fetched',
        data: shiftException,
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
   * /shift-exception/{id}:
   *   put:
   *     summary: Update a shift exception by ID
   *     tags: [ShiftException]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID of the shift exception to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ShiftException'
   *     responses:
   *       200:
   *         description: Shift exception updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShiftException'
   *       400:
   *         description: Validation error
   *       404:
   *         description: Shift exception not found
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createShiftExceptionValidator)
      const shiftException = await ShiftException.findOrFail(params.id)
      shiftException.merge(data)
      await shiftException.save()
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource updated',
        data: shiftException.toJSON(),
      })
    } catch (error) {
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: error.messages,
        data: null,
      })
    }
  }
  /**
   * @swagger
   * /shift-exception/{id}:
   *   delete:
   *     summary: Delete a shift exception by ID
   *     tags: [ShiftException]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID of the shift exception to delete
   *     responses:
   *       200:
   *         description: Shift exception deleted
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShiftException'
   *       404:
   *         description: Shift exception not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const shiftException = await ShiftException.findOrFail(params.id)
      await shiftException.delete()
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource deleted',
        data: shiftException.toJSON(),
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
