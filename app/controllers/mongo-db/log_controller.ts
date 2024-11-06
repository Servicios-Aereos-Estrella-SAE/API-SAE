import { HttpContext } from '@adonisjs/core/http'
import { LogFilterSearchInterface } from '../../interfaces/MongoDB/log_filter_search_interface.js'
import { LogStore } from '#models/MongoDB/log_store'
export default class LogController {
  /**
   * @swagger
   * /api/logs:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Logs
   *     summary: get log info by entity
   *     parameters:
   *       - name: entity
   *         in: query
   *         required: true
   *         description: Entity
   *         schema:
   *           type: string
   *       - name: userId
   *         in: query
   *         required: true
   *         description: The user id
   *         schema:
   *           type: integer
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for filtering
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for filtering
   *       - in: query
   *         name: otherFilters
   *         style: deepObject
   *         explode: true
   *         schema:
   *           type: object
   *           additionalProperties:
   *             type: string
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
  async index({ request, response }: HttpContext) {
    try {
      const entity = request.input('entity')
      const userId = request.input('userId')
      const startDate = request.input('startDate')
      const endDate = request.input('endDate')
      const otherFilters = request.input('otherFilters')
      const filters = {
        entity: entity,
        userId: userId,
        startDate: startDate,
        endDate: endDate,
        otherFilters: otherFilters,
      } as LogFilterSearchInterface
      const info = await LogStore.get(filters)

      response.status(200)
      return {
        type: 'success',
        title: 'Logs',
        message: 'The logs were found successfully',
        data: {
          info,
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
