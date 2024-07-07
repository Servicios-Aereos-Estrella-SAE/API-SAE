import SyncAssistsService from '#services/sync_assists_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import ExcelJS from 'exceljs'

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
   * /api/v1/assists/status:
   *   get:
   *     summary: Retrieve the status of the sync assists operation
   *     tags: [Assists]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Status retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AssistStatusResponseDto'
   *       400:
   *         description: Error retrieving status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Error al obtener el estado de sincronización"
   */
  @inject()
  async getStatusSync({ response }: HttpContext, syncAssistsService: SyncAssistsService) {
    return response.status(200).json(await syncAssistsService.getStatusSync())
  }

  /**
   * @swagger
   * /api/v1/assists:
   *   get:
   *     summary: get assists list
   *     security:
   *       - bearerAuth: []
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
   *         required: true
   *         schema:
   *           type: string
   *         default: "2024-12-31"
   *         description: Date limit to get list
   *       - name: employeeId
   *         in: query
   *         required: true
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
   *               example: {}
   *       400:
   *         description: Invalid data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async index({ request, response }: HttpContext) {
    const syncAssistsService = new SyncAssistsService()
    const employeeID = request.input('employeeId')
    const filterDate = request.input('date')
    const filterDateEnd = request.input('date-end')
    const page = request.input('page')
    const limit = request.input('limit')

    try {
      const result = await syncAssistsService.index(
        {
          date: filterDate,
          dateEnd: filterDateEnd,
          employeeID: employeeID,
        },
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

  /**
   * @swagger
   * /api/v1/assists/get-excel:
   *   get:
   *     summary: get assists excel
   *     security:
   *       - bearerAuth: []
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
   *         required: true
   *         schema:
   *           type: string
   *         default: "2024-12-31"
   *         description: Date limit to get list
   *       - name: employeeId
   *         in: query
   *         required: true
   *         schema:
   *           type: number
   *         description: Employee id
   *     responses:
   *       200:
   *         description: Resource action successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example: {}
   *       400:
   *         description: Invalid data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async getExcel({ request, response }: HttpContext) {
    try {
      const employeeID = request.input('employeeId')
      const filterDate = request.input('date')
      const filterDateEnd = request.input('date-end')
      let apiUrl = `${env.get('HOST')}:${env.get('PORT')}/api/v1/assists`
      apiUrl = `${apiUrl}?date=${filterDate || ''}`
      apiUrl = `${apiUrl}&date-end=${filterDateEnd || ''}`
      apiUrl = `${apiUrl}&employeeId=${employeeID || ''}`
      /*  const apiResponse = await axios.get(apiUrl)
      const data = apiResponse.data.data
      if (data) {
        console.log(data)
      } */
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')

      // Añadir columnas
      worksheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Cargo', key: 'cargo', width: 20 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Día de Semana', key: 'dia_semana', width: 20 },
        { header: 'Primera Checada', key: 'primera_checada', width: 20 },
        { header: 'Última Checada', key: 'ultima_checada', width: 20 },
        { header: 'Notas', key: 'notas', width: 30 },
        { header: 'Prima Dominical', key: 'prima_dominical', width: 20 },
      ]

      const rows = [{}]

      worksheet.addRows(rows)

      // Establecer el encabezado de respuesta para la descarga del archivo
      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      response.header('Content-Disposition', 'attachment; filename=datos.xlsx')

      // Enviar el archivo Excel en la respuesta
      await workbook.xlsx.write(response.response)
      // return response.status(data.status).json(data)
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
