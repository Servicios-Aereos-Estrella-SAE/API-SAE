import { HttpContext } from '@adonisjs/core/http'
import AircraftProceedingFile from '../models/aircraft_proceeding_file.js'
import {
  createAircraftProceedingFileValidator,
  updateAircraftProceedingFileValidator,
} from '../validators/create_aircraft_proceeding_file.js'
import { formatResponse } from '../helpers/responseFormatter.js'

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
}