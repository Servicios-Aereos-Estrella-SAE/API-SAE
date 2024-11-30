import { HttpContext } from '@adonisjs/core/http'
import Tolerance from '../models/tolerance.js'
import ToleranceService from '#services/tolerance_service'

export default class TolerancesController {
  /**
   * @swagger
   * /api/tolerances:
   *   get:
   *     summary: Get all tolerances
   *     tags:
   *       - Tolerances
   *     responses:
   *       200:
   *         description: Returns a list of tolerances
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Tolerance'
   */
  async index({ response }: HttpContext) {
    const tolerances = await new ToleranceService().index()
    return response.ok({ data: tolerances })
  }

  /**
   * @swagger
   * /api/tolerances:
   *   post:
   *     summary: Create a new tolerance
   *     tags:
   *       - Tolerances
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               tolerance_name:
   *                 type: string
   *               tolerance_minutes:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Tolerance created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Tolerance'
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['tolerance_name', 'tolerance_minutes'])

    const tolerance = await Tolerance.create({
      toleranceName: data.tolerance_name,
      toleranceMinutes: data.tolerance_minutes,
    })

    return response.created({ data: tolerance })
  }

  /**
   * @swagger
   * /api/tolerances/{id}:
   *   get:
   *     summary: Get a single tolerance by ID
   *     tags:
   *       - Tolerances
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Returns the specified tolerance
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Tolerance'
   *       404:
   *         description: Tolerance not found
   */
  async show({ params, response }: HttpContext) {
    const tolerance = await Tolerance.find(params.id)
    if (!tolerance) {
      return response.notFound({ message: 'Tolerance not found' })
    }
    return response.ok({ data: tolerance })
  }

  /**
   * @swagger
   * /api/tolerances/{id}:
   *   put:
   *     summary: Update an existing tolerance
   *     tags:
   *       - Tolerances
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               tolerance_name:
   *                 type: string
   *               tolerance_minutes:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Tolerance updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Tolerance'
   *       404:
   *         description: Tolerance not found
   */
  async update({ params, request, response }: HttpContext) {
    const tolerance = await Tolerance.find(params.id)
    if (!tolerance) {
      return response.notFound({ message: 'Tolerance not found' })
    }

    tolerance.toleranceName = request.input('tolerance_name')
    tolerance.toleranceMinutes = request.input('tolerance_minutes')

    await tolerance.save()

    return response.ok({ data: tolerance })
  }

  /**
   * @swagger
   * /api/tolerances/{id}:
   *   delete:
   *     summary: Set tolerance_minutes to 0 without modifying tolerance_name
   *     tags:
   *       - Tolerances
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Tolerance minutes set to 0
   *       404:
   *         description: Tolerance not found
   */
  async destroy({ params, response }: HttpContext) {
    const tolerance = await Tolerance.find(params.id)
    if (!tolerance) {
      return response.notFound({ message: 'Tolerance not found' })
    }
    tolerance.toleranceMinutes = 0
    await tolerance.save()

    return response.ok({ message: 'Tolerance minutes set to 0' })
  }

  /**
   * @swagger
   * /api/tolerances/get-tardiness-tolerance:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Tolerances
   *     summary: get tardiness tolerance
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
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: Object processed
   *       '404':
   *         description: The resource could not be found
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
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request.
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
   *                   description: Response message
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
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async getTardinessTolerance({ response }: HttpContext) {
    try {
      const toleranceService = new ToleranceService()
      const tardinessTolerance = await toleranceService.getTardinessTolerance()
      response.status(200)
      return {
        type: 'success',
        title: 'Tolerance',
        message: 'The tardiness tolerance found successfully',
        data: {
          tardinessTolerance,
        },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server Error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }
}
