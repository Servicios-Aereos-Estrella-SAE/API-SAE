/* eslint-disable no-console */
// Importa el validador adecuado
import { HttpContext } from '@adonisjs/core/http'
import Shift from '../models/shift.js'
import { createShiftValidator, updateShiftValidator } from '../validators/shift.js'
import { DateTime } from 'luxon'

/**
 * @swagger
 * /api/shift:
 *   post:
 *     tags:
 *       - Shifts
 *     summary: Create a new shift
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shiftName:
 *                 type: string
 *               shiftDayStart:
 *                 type: number
 *               shiftTimeStart:
 *                 type: string
 *               shiftActiveHours:
 *                 type: number
 *               shiftRestDays:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Shift created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 shiftName:
 *                   type: string
 *                 shiftDayStart:
 *                   type: number
 *                 shiftTimeStart:
 *                   type: string
 *                 shiftActiveHours:
 *                   type: number
 *                 shiftRestDays:
 *                   type: string
 *       '400':
 *         description: Invalid input, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export default class ShiftController {
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createShiftValidator)
      const shift = await Shift.create(data)
      return response.status(201).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource created',
        data: shift.toJSON(),
      })
    } catch (error) {
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: 'Invalid input, validation error',
        data: error.messages,
      })
    }
  }

  /**
   * @swagger
   * /api/shift:
   *   get:
   *     tags:
   *       - Shifts
   *     summary: Get all shifts with optional filters
   *     parameters:
   *       - in: query
   *         name: shiftDayStart
   *         schema:
   *           type: number
   *         description: Filter by shift day start
   *       - in: query
   *         name: shiftName
   *         schema:
   *           type: string
   *         description: Filter by shift name
   *       - in: query
   *         name: shiftActiveHours
   *         schema:
   *           type: number
   *         description: Filter by shift active hours
   *     responses:
   *       '200':
   *         description: A list of shifts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: number
   *                   shiftName:
   *                     type: string
   *                   shiftDayStart:
   *                     type: number
   *                   shiftTimeStart:
   *                     type: string
   *                   shiftActiveHours:
   *                     type: number
   *                   shiftRestDays:
   *                     type: string
   */

  async index({ request, response }: HttpContext) {
    try {
      const { shiftDayStart, shiftName, shiftActiveHours } = request.qs()

      const query = Shift.query().whereNull('shiftDeletedAt')

      if (shiftDayStart) {
        query.where('shiftDayStart', shiftDayStart)
      }

      if (shiftName) {
        query.where('shiftName', 'LIKE', `%${shiftName}%`)
      }

      if (shiftActiveHours) {
        query.where('shiftActiveHours', shiftActiveHours)
      }

      const shifts = await query
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resources fetched',
        data: shifts.map((shift) => shift.toJSON()),
      })
    } catch (error) {
      return response.status(500).json({
        type: 'error',
        title: 'Server error',
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * @swagger
   * /api/shift/{id}:
   *   get:
   *     tags:
   *       - Shifts
   *     summary: Get a shift by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Shift retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: number
   *                 shiftName:
   *                   type: string
   *                 shiftDayStart:
   *                   type: number
   *                 shiftTimeStart:
   *                   type: string
   *                 shiftActiveHours:
   *                   type: number
   *                 shiftRestDays:
   *                   type: string
   *       '404':
   *         description: Shift not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  async show({ params, response }: HttpContext) {
    try {
      const shift = await Shift.findOrFail(params.id)
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource fetched',
        data: shift.toJSON(),
      })
    } catch (error) {
      return response.status(404).json({
        type: 'error',
        title: 'Not found',
        message: 'Shift not found',
        data: null,
      })
    }
  }

  /**
   * @swagger
   * /api/shift/{id}:
   *   put:
   *     tags:
   *       - Shifts
   *     summary: Update a shift by ID
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
   *               shiftName:
   *                 type: string
   *               shiftDayStart:
   *                 type: number
   *               shiftTimeStart:
   *                 type: string
   *               shiftActiveHours:
   *                 type: number
   *               shiftRestDays:
   *                 type: string
   *     responses:
   *       '200':
   *         description: Shift updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: number
   *                 shiftName:
   *                   type: string
   *                 shiftDayStart:
   *                   type: number
   *                 shiftTimeStart:
   *                   type: string
   *                 shiftActiveHours:
   *                   type: number
   *                 shiftRestDays:
   *                   type: string
   *       '400':
   *         description: Invalid input, validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       '404':
   *         description: Shift not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateShiftValidator(params.id))
      const shift = await Shift.findOrFail(params.id)
      shift.merge(data)
      await shift.save()
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource updated',
        data: shift.toJSON(),
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          type: 'error',
          title: 'Not found',
          message: 'Shift not found',
          data: null,
        })
      }
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: 'Invalid input, validation error',
        data: error.messages || error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/shifts/{id}:
   *   delete:
   *     tags:
   *       - Shifts
   *     summary: Soft delete a shift
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: number
   *         required: true
   *         description: Numeric ID of the shift to delete
   *     responses:
   *       '200':
   *         description: Shift deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       '404':
   *         description: Shift not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const shift = await Shift.findOrFail(params.id)
      shift.shiftDeletedAt = DateTime.now()
      await shift.save()
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource deleted',
        data: shift.toJSON(),
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          type: 'error',
          title: 'Not found',
          message: 'Shift not found',
          data: null,
        })
      }
      return response.status(500).json({
        type: 'error',
        title: 'Server error',
        message: 'An error occurred while deleting the shift',
        data: error.message,
      })
    }
  }
}
