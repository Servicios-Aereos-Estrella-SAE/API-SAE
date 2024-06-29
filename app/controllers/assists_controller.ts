import SyncAssistsService from '#services/sync_assists_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

export default class AssistsController {
  /**
   * @swagger
   * /api/v1/assists/synchronize:
   *   post:
   *     summary: Synchronize assists
   *     security:
   *       - bearerAuth: []
   *     tags: [Assists]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               date:
   *                 type: string
   *                 format: date
   *                 example: "2023-01-01"
   *               page:
   *                 type: number
   *                 example: "1"
   *     responses:
   *       200:
   *         description: Synchronization started
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Proceso de sincronización iniciado
   *       400:
   *         description: Synchronization in progress or other error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Ya se encuentra un proceso en sincronización, por favor espere
   */
  @inject()
  async synchronize({ request, response }: HttpContext, syncAssistsService: SyncAssistsService) {
    const dateParamApi = request.input('date')
    const page = request.input('page')

    try {
      const result = await syncAssistsService.synchronize(dateParamApi, page)
      return response.status(200).json(result)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * @swagger
   * /api/v1/assists:
   *   get:
   *     summary: get assists list
   *     tags: [Assists]
   *     parameters:
   *       - name: date
   *         in: query
   *         required: true
   *         schema:
   *           type: string
   *         default: "2023-01-01"
   *         description: Date from get list
   *       - name: date-end
   *         in: query
   *         required: false
   *         schema:
   *           type: string
   *         default: "2024-12-31"
   *         description: Date limit to get list, if not setted default is NOW()
   *       - name: page
   *         in: query
   *         required: false
   *         schema:
   *           type: number
   *         default: "1"
   *         description: Number of paginator page
   *       - name: limit
   *         in: query
   *         required: false
   *         schema:
   *           type: number
   *         default: "50"
   *         description: Number of limit on paginator page
   *       - name: employee
   *         in: query
   *         required: false
   *         schema:
   *           type: number
   *         description: Number of limit on paginator page
   *     responses:
   *       200:
   *         description: Resource action successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *       400:
   *         description: Invalid data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async index({ request, response }: HttpContext) {
    const syncAssistsService = new SyncAssistsService()
    const employeeID = request.input('employee')
    const filterDate = request.input('date')
    const filterDateEnd = request.input('date-end')
    const page = request.input('page')
    const limit = request.input('limit')

    try {
      const result = await syncAssistsService.index(
        { date: filterDate, dateEnd: filterDateEnd, employeeID: employeeID },
        { page, limit }
      )
      return response.status(result.status).json(result)
    } catch (error) {
      return response.status(400).json({
        type: 'success',
        title: 'Successfully action',
        message: error.message,
        data: error.response || null,
      })
    }
  }
}
