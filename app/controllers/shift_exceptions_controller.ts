import ShiftExceptionService from '#services/shift_exception_service'
import { ShiftExceptionFilterInterface } from '../interfaces/shift_exception_filter_interface.js'
import ShiftException from '../models/shift_exception.js'
import { createShiftExceptionValidator } from '../validators/shift_exception.js'
import { HttpContext } from '@adonisjs/core/http'

export default class ShiftExceptionController {
  /**
   * @swagger
   * /api/shift-exception:
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
   * /api/shift-exception:
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
      await shiftException.load('exceptionType')
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
   * /api/shift-exception/{id}:
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
      await shiftException.load('exceptionType')
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
   * /api/shift-exception/{id}:
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
      await shiftException.load('exceptionType')
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
   * /api/shift-exception/{id}:
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

  /**
   * @swagger
   * /api/shift-exception-employee/{employeeId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - ShiftException
   *     summary: get shifts exceptions by employee
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         description: Employee id
   *         required: true
   *       - name: exceptionTypeId
   *         in: query
   *         required: false
   *         description: Exception type id
   *         schema:
   *           type: number
   *       - name: dateStart
   *         in: query
   *         required: false
   *         description: Date start (YYYY-MM-DD)
   *         format: date
   *         schema:
   *           type: string
   *       - name: dateEnd
   *         in: query
   *         required: false
   *         description: Date end (YYYY-MM-DD)
   *         format: date
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async getByEmployee({ request, response }: HttpContext) {
    try {
      const employeeId = request.param('employeeId')
      const exceptionTypeId = request.input('exceptionTypeId')
      const dateStart = request.input('dateStart')
      const dateEnd = request.input('dateEnd')
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee Id was not found',
          message: 'Missing data to process',
          data: { employeeId },
        }
      }
      const filters = {
        employeeId: employeeId,
        exceptionTypeId: exceptionTypeId,
        dateStart: dateStart,
        dateEnd: dateEnd,
      } as ShiftExceptionFilterInterface
      const shiftExceptionService = new ShiftExceptionService()
      const shiftExceptions = await shiftExceptionService.getByEmployee(filters)
      response.status(200)
      return {
        type: 'success',
        title: 'Shift exceptions',
        message: 'The shift exceptions were found successfully',
        data: {
          shiftExceptions: shiftExceptions,
        },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }
}
