import { HttpContext } from '@adonisjs/core/http'
import AircraftProceedingFile from '../models/aircraft_proceeding_file.js'
import {
  createAircraftProceedingFileValidator,
  updateAircraftProceedingFileValidator,
} from '../validators/create_aircraft_proceeding_file.js'
import { formatResponse } from '../helpers/responseFormatter.js'
import AircraftProceedingFileService from '#services/aircraft_proceeding_file_service'
import { AircraftProceedingFileFilterInterface } from '../interfaces/aircraft_proceeding_file_filter_interface.js'

export default class AircraftProceedingFileController {
  /**
   * @swagger
   * tags:
   *   - name: Aircrafts Proceeding Files
   *     description: Operations related to aircrafts proceeding files
   *
   * /api/aircraft-proceeding-files:
   *   get:
   *     tags:
   *       - Aircrafts Proceeding Files
   *     summary: Obtener todos los registros de archivos de procedimientos de aeronaves
   *     responses:
   *       200:
   *         description: Lista de archivos de procedimientos de aeronaves
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/AircraftProceedingFile'
   */
  async index({ response }: HttpContext) {
    const files = await AircraftProceedingFile.all()
    return response.json({
      status: 'success',
      data: files,
    })
  }
  /**
   * @swagger
   * /api/aircraft-proceeding-files:
   *   post:
   *     tags:
   *       - Aircrafts Proceeding Files
   *     summary: Crear un nuevo archivo de procedimiento de aeronave
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateAircraftProceedingFile'
   *     responses:
   *       200:
   *         description: Archivo de procedimiento de aeronave creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Aircraft proceeding file created successfully.
   *                 data:
   *                   $ref: '#/components/schemas/AircraftProceedingFile'
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createAircraftProceedingFileValidator)

    const newFile = await AircraftProceedingFile.create({
      aircraftId: payload.aircraftId,
      proceedingFileId: payload.proceedingFileId,
    })

    return response.json({
      status: 'success',
      message: 'Aircraft proceeding file created successfully.',
      data: newFile,
    })
  }
  /**
   * @swagger
   * /api/aircraft-proceeding-files/{id}:
   *   get:
   *     tags:
   *       - Aircrafts Proceeding Files
   *     summary: Mostrar un archivo de procedimiento de aeronave por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Archivo de procedimiento de aeronave encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/AircraftProceedingFile'
   */
  async show({ params, response }: HttpContext) {
    const file = await AircraftProceedingFile.findOrFail(params.id)
    return response.json({
      status: 'success',
      data: file,
    })
  }
  /**
   * @swagger
   * /api/aircraft-proceeding-files/{id}:
   *   put:
   *     tags:
   *       - Aircrafts Proceeding Files
   *     summary: Actualizar un archivo de procedimiento de aeronave por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateAircraftProceedingFile'
   *     responses:
   *       200:
   *         description: Archivo de procedimiento de aeronave actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Aircraft proceeding file updated successfully.
   *                 data:
   *                   $ref: '#/components/schemas/AircraftProceedingFile'
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateAircraftProceedingFileValidator)
    const file = await AircraftProceedingFile.findOrFail(params.id)

    file.merge({
      aircraftId: payload.aircraftId,
      proceedingFileId: payload.proceedingFileId,
    })

    await file.save()

    return response.json({
      status: 'success',
      message: 'Aircraft proceeding file updated successfully.',
      data: file,
    })
  }
  /**
   * @swagger
   * /api/aircraft-proceeding-files/{id}:
   *   delete:
   *     tags:
   *       - Aircrafts Proceeding Files
   *     summary: Eliminar un archivo de procedimiento de aeronave por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Archivo de procedimiento de aeronave eliminado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Aircraft proceeding file deleted successfully.
   */
  async destroy({ params, response }: HttpContext) {
    const file = await AircraftProceedingFile.findOrFail(params.id)
    await file.delete()

    return response.json({
      status: 'success',
      message: 'Aircraft proceeding file deleted successfully.',
    })
  }
  /**
   * @swagger
   * /api/aircraft-proceeding-files/{aircraftId}:
   *   get:
   *     tags:
   *       - Aircrafts Proceeding Files
   *     summary: Obtener archivos de procedimiento de aeronave
   *     parameters:
   *       - in: path
   *         name: aircraftId
   *         required: true
   *         description: ID de la aeronave para la que se desean obtener los archivos de procedimiento.
   *         schema:
   *           type: string
   *           example: "12345"  # Reemplaza con un ID de aeronave de ejemplo
   *       - in: query
   *         name: page
   *         required: false
   *         description: Número de página para la paginación de resultados.
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         description: Número de resultados por página.
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Archivos de procedimiento de aeronave obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Proceeding files fetched successfully.
   *                 data:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                       example: 2
   *                     per_page:
   *                       type: integer
   *                       example: 10
   *                     current_page:
   *                       type: integer
   *                       example: 1
   *                     last_page:
   *                       type: integer
   *                       example: 1
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/AircraftProceedingFile'  # Asegúrate de definir este esquema en tu documentación
   *       400:
   *         description: Error de solicitud, ID de aeronave no proporcionado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: warning
   *                 message:
   *                   type: string
   *                   example: Aircraft ID not found
   *                 data:
   *                   type: object
   *                   properties:
   *                     aircraftId:
   *                       type: string
   *                       example: null
   *       404:
   *         description: No se encontraron archivos de procedimiento
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: warning
   *                 message:
   *                   type: string
   *                   example: No proceeding files found
   *                 data:
   *                   type: object
   *                   properties:
   *                     aircraftId:
   *                       type: string
   *                       example: "12345"
   *       500:
   *         description: Error en el servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Server error
   *                 data:
   *                   type: object
   *                   properties:
   *                     error:
   *                       type: string
   *                       example: Unexpected error occurred on the server.
   */
  async getAircraftProceedingFiles({ request, response }: HttpContext) {
    try {
      const aircraftId = request.param('aircraftId')
      if (!aircraftId) {
        response.status(400)
        return formatResponse('warning', 'Aircraft ID not found', 'Missing data to process', {
          aircraftId,
        })
      }
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const mainQuery = AircraftProceedingFile.query()
        .whereNull('deletedAt')
        .where('aircraftId', aircraftId)
        .preload('proceedingFile', (fileQuery) => {
          fileQuery.preload('proceedingFileType')
        })
        .orderBy('aircraftProceedingFileCreatedAt', 'desc')

      const aircraftProceedingFiles = await mainQuery.paginate(page, limit)

      if (aircraftProceedingFiles.total === 0) {
        response.status(404)
        return formatResponse(
          'warning',
          'No proceeding files found',
          'No proceeding files found for the given aircraft ID',
          { aircraftId }
        )
      }

      return response
        .status(200)
        .json(
          formatResponse(
            'success',
            'Proceeding files fetched successfully',
            'The proceeding files for the aircraft were found successfully',
            aircraftProceedingFiles.toJSON()
          )
        )
    } catch (error) {
      response.status(500)
      return formatResponse(
        'error',
        'Server error',
        'An unexpected error has occurred on the server',
        { error: error.message }
      )
    }
  }

  /**
   * @swagger
   * /api/aircrafts-proceeding-files/get-expired-and-expiring:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Aircrafts Proceeding Files
   *     summary: get expired and expiring proceeding files by date
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: dateStart
   *         in: query
   *         required: false
   *         description: Date start (YYYY-MM-DD)
   *         format: date
   *         schema:
   *           type: string
   *       - name: dateEnd
   *         in: query
   *         required: false
   *         description: Date end (YYYY-MM-DD)
   *         format: date
   *         schema:
   *           type: string
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
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
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
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
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
   *                   description: Message of response
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
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async getExpiresAndExpiring({ request, response }: HttpContext) {
    try {
      const dateStart = request.input('dateStart')
      const dateEnd = request.input('dateEnd')
      const filters = {
        dateStart: dateStart,
        dateEnd: dateEnd,
      } as AircraftProceedingFileFilterInterface
      const aircraftProceddingFileService = new AircraftProceedingFileService()
      const aircraftProceedingFiles =
        await aircraftProceddingFileService.getExpiredAndExpiring(filters)
      response.status(200)
      return {
        type: 'success',
        title: 'Aircraft proceeding files',
        message: 'The aircraft proceeding files were found successfully',
        data: {
          aircraftProceedingFiles: aircraftProceedingFiles,
        },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }
}
