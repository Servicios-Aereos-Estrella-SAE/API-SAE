import { HttpContext } from '@adonisjs/core/http'
import { LogFilterSearchInterface } from '../../interfaces/MongoDB/log_filter_search_interface.js'
import { LogStore } from '#models/MongoDB/log_store'
import { LogRequest } from '#models/MongoDB/log_request'
export default class LogController {
  /**
   * @swagger
   * /api/logs:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Logs
   *     summary: get log info by entity
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               entity:
   *                 type: string
   *                 description: The entity name
   *                 required: true
   *               userId:
   *                 type: integer
   *                 description: The user id
   *                 required: true
   *               startDate:
   *                 type: string
   *                 format: date
   *                 description: Start date for filtering (YYYY-MM-DD)
   *                 required: true
   *               endDate:
   *                 type: string
   *                 format: date
   *                 description: End date for filtering (YYYY-MM-DD)
   *                 required: true
   *               otherFilters:
   *                 type: object
   *                 description: Others additional filters
   *                 style: deepObject
   *                 explode: true
   *                 required: false
   *                 schema:
   *                   type: object
   *                   additionalProperties:
   *                     type: string
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

      const logRequest = LogRequest.getInstance()
      if (!logRequest.isConnected) {
        logRequest.scheduleReconnect()
        response.status(400)
        return {
          type: 'warning',
          title: 'Connection error',
          message: 'Did not connect to mongo.',
          data: { ...filters },
        }
      }
      const exists = await logRequest.collectionExists(filters.entity)

      if (!exists) {
        return {
          type: 'warning',
          title: 'Model mongo db',
          message: `Collection ${filters.entity} does not exist in MongoDB`,
          data: { ...filters },
        }
      }
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
