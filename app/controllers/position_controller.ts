import Position from '#models/position'
import PositionService from '#services/position_service'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import BiometricPositionInterface from '../interfaces/biometric_position_interface.js'

export default class PositionController {
  /**
   * @swagger
   * /api/synchronization/positions:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Posiciones
   *     summary: Sincronización de Información
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               page:
   *                 type: integer
   *                 description: Número de pagina para paginación
   *                 required: false
   *                 default: 1
   *               limit:
   *                 type: integer
   *                 description: Número de renglones por página
   *                 required: false
   *                 default: 200
   *               positionCode:
   *                 type: string
   *                 description: Código de posición para filtrar
   *                 required: false
   *                 default: ''
   *               positionName:
   *                 required: false
   *                 description: Nombre de posición para filtrar
   *                 type: string
   *                 default: ''
   *     responses:
   *       '200':
   *         description: Recurso procesado de manera exitosa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Objeto procesado
   *       '404':
   *         description: No se ha encontrado el recurso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       '400':
   *         description: Los parametros ingresados son invalidos o faltan datos necesarios para procesar la solicitud
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       default:
   *         description: Error inesperado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Mensaje de error obtenido
   *                   properties:
   *                     error:
   *                       type: string
   */

  async synchronization({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 200)
      const positionCode = request.input('positionCode')
      const positionName = request.input('positionName')

      let apiUrl = `${env.get('API_BIOMETRICS_HOST')}/positions`
      apiUrl = `${apiUrl}?page=${page || ''}`
      apiUrl = `${apiUrl}&limit=${limit || ''}`
      apiUrl = `${apiUrl}&positionCode=${positionCode || ''}`
      apiUrl = `${apiUrl}&positionName=${positionName || ''}`
      const apiResponse = await axios.get(apiUrl)
      const data = apiResponse.data.data
      if (data) {
        const positionService = new PositionService()
        data.sort((a: BiometricPositionInterface, b: BiometricPositionInterface) => a.id - b.id)
        for await (const position of data) {
          await this.verify(position, positionService)
        }
        response.status(200)
        return {
          type: 'success',
          title: 'Sincronización de posiciones',
          message: 'Se han sincronizado las posiciones correctamente',
          data: {
            data,
          },
        }
      } else {
        response.status(404)
        return {
          type: 'warning',
          title: 'Sincronización de posiciones',
          message: 'No se encontraron datos para sincronizar',
          data: { data },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Error de servidor',
        message: 'Se ha presentado un error inesperado en el servidor',
        error: error.message,
      }
    }
  }

  private async verify(position: BiometricPositionInterface, positionService: PositionService) {
    const existPosition = await Position.query().where('position_sync_id', position.id).first()
    if (!existPosition) {
      await positionService.create(position)
    } else {
      positionService.update(position, existPosition)
    }
  }
}