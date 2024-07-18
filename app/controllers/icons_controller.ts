// import type { HttpContext } from '@adonisjs/core/http'

import Icon from '#models/icon'
import { HttpContext } from '@adonisjs/core/http'

export default class IconsController {
  /**
   * @swagger
   * /api/icons:
   *   get:
   *     tags:
   *       - Icons
   *     summary: Retrieve a list of icons
   *     responses:
   *       200:
   *         description: A list of icons
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Icon'
   *       500:
   *         description: Internal server error
   */
  async index({ response }: HttpContext) {
    try {
      const icons = await Icon.query()
      return response.json(icons)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}
