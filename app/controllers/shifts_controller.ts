// Importa el validador adecuado
import { HttpContext } from '@adonisjs/core/http'
import Shift from '../models/shift.js'
import { createShiftValidator } from '../validators/shift.js'
/**
 * @swagger
 * /api/shifts:
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
      return response.status(201).json(shift)
    } catch (error) {
      return response.status(400).json({ message: error.messages })
    }
  }
}
