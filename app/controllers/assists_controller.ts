import SyncAssistsService from '#services/sync_assists_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

export default class AssistsController {
  /**
   * @swagger
   * /api/v1/assists/synchronize:
   *   post:
   *     summary: Synchronize assists
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
      return response.status(202).json(result)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }
}
