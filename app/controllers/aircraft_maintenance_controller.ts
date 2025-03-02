import { HttpContext } from '@adonisjs/core/http'
import AircraftMaintenance from '#models/aircraft_maintenance'
import { GenericFilterSearchInterface } from '../interfaces/generic_filter_search_interface.js'
import AircraftMaintenanceService from '#services/aircraft_maintenance_service'
import { createAircraftMaintenanceValidator } from '#validators/aircraft_maintenance'

export default class AircraftMaintenanceController {
  /**
   * @swagger
   * /api/aircraft-maintenances:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Aircraft Maintenances
   *     summary: Get all Aircraft Maintenances
   *     parameters:
   *       - name: search
   *         in: query
   *         required: false
   *         description: Search
   *         schema:
   *           type: string
   *       - name: page
   *         in: query
   *         required: true
   *         default: 1
   *         schema:
   *           type: integer
   *       - name: limit
   *         in: query
   *         required: true
   *         default: 100
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: List of aircraft maintenances fetched successfully
   *       '400':
   *         description: Invalid parameters
   *       '404':
   *         description: Not found
   *       '500':
   *         description: Server error
   */
  async index({ request, response }: HttpContext) {
    try {
      const search = request.input('search')
      const page = request.input('page', 1)
      const limit = request.input('limit', 100)
      const aircraftId = request.input('aircraftId')
      const date = request.input('date')
      // get start of month from date and end of month
      const dateParam = new Date(date)
      const startOfMonth = new Date(dateParam.getFullYear(), dateParam.getMonth(), 1)
      // get endOfMonth and add time to end of day to get all the day
      const endOfMonth = new Date(dateParam.getFullYear(), dateParam.getMonth() + 1, 0, 23, 59, 59)
      const filters = {
        search,
        page,
        limit,
      } as GenericFilterSearchInterface

      const aircraftMaintenanceService = new AircraftMaintenanceService()
      const aircraftMaintenances = await aircraftMaintenanceService.index(
        filters,
        aircraftId,
        startOfMonth,
        endOfMonth
      )

      response.status(200)
      return {
        type: 'success',
        title: 'Aircraft Maintenances',
        message: 'The aircraft maintenances were found successfully',
        data: { aircraftMaintenances },
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

  /**
   * @swagger
   * /api/aircraft-maintenances:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Aircraft Maintenances
   *     summary: Create new Aircraft Maintenance
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               aircraftId:
   *                 type: number
   *                 description: FK to aircrafts table
   *               maintenanceTypeId:
   *                 type: number
   *                 description: FK to maintenance_types table
   *               aircraftMaintenanceStartDate:
   *                 type: date-time
   *                 description: Start date of the maintenance
   *               aircraftMaintenanceEndDate:
   *                 type: date-time
   *                 description: End date of the maintenance
   *               maintenanceUrgencyLevelId:
   *                 type: number
   *                 description: FK to aircraft_maintenance_urgency_levels table
   *               aircraftMaintenanceStatusId:
   *                 type: number
   *                 description: FK to aircraft_maintenance_statuses table
   *               aircraftMaintenanceNotes:
   *                 type: string
   *                 description: Notes
   *     responses:
   *       '201':
   *         description: Aircraft Maintenance created
   *       '400':
   *         description: Missing parameters or validation error
   *       '500':
   *         description: Server error
   */
  async store({ request, response }: HttpContext) {
    try {
      let aircraftMaintenanceStartDate = request.input('aircraftMaintenanceStartDate')
      aircraftMaintenanceStartDate = (
        aircraftMaintenanceStartDate.split('T')[0] +
        ' ' +
        aircraftMaintenanceStartDate.split('T')[1].split('.')[0]
      ).replace('"', '')

      let aircraftMaintenanceEndDate = request.input('aircraftMaintenanceEndDate')
      aircraftMaintenanceEndDate = (
        aircraftMaintenanceEndDate.split('T')[0] +
        ' ' +
        aircraftMaintenanceEndDate.split('T')[1].split('.')[0]
      ).replace('"', '')
      // Creamos el objeto parcial para la nueva reservación
      const aircraftMaintenanceData = {
        aircraftId: request.input('aircraftId'),
        maintenanceTypeId: request.input('maintenanceTypeId'),
        aircraftMaintenanceStartDate,
        aircraftMaintenanceEndDate,
        maintenanceUrgencyLevelId: request.input('maintenanceUrgencyLevelId'),
        aircraftMaintenanceStatusId: request.input('aircraftMaintenanceStatusId'),
        aircraftMaintenanceNotes: request.input('aircraftMaintenanceNotes'),
      } as AircraftMaintenance

      // Validación con Vine (opcional, si tienes un validator):
      const data = await request.validateUsing(createAircraftMaintenanceValidator)

      // Lógica de verificación adicional en el service (si aplica)
      const aircraftMaintenanceService = new AircraftMaintenanceService()
      const valid = await aircraftMaintenanceService.verifyInfo(aircraftMaintenanceData, 0)
      if (valid.status !== 200) {
        response.status(valid.status)
        return {
          type: valid.type,
          title: valid.title,
          message: valid.message,
          data: { ...data },
        }
      }

      // Creamos la nueva reservación
      const newReservation = await aircraftMaintenanceService.create(aircraftMaintenanceData)

      response.status(201)
      return {
        type: 'success',
        title: 'Reservations',
        message: 'The reservation was created successfully',
        data: { reservation: newReservation },
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }

  /**
   * @swagger
   * /api/aircraft-maintenances/{aircraftMaintenanceId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Aircraft Maintenances
   *     summary: Update aircraft maintenance
   *     parameters:
   *       - in: path
   *         name: aircraftMaintenanceId
   *         schema:
   *           type: number
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               aircraftId:
   *                 type: number
   *                 description: FK to aircrafts table
   *               maintenanceTypeId:
   *                 type: number
   *                 description: FK to maintenance_types table
   *               aircraftMaintenanceStartDate:
   *                 type: date-time
   *                 description: Start date of the maintenance
   *               aircraftMaintenanceEndDate:
   *                 type: date-time
   *                 description: End date of the maintenance
   *               maintenanceUrgencyLevelId:
   *                 type: number
   *                 description: FK to aircraft_maintenance_urgency_levels table
   *               aircraftMaintenanceStatusId:
   *                 type: number
   *                 description: FK to aircraft_maintenance_statuses table
   *               aircraftMaintenanceNotes:
   *                 type: string
   *                 description: Notes
   *     responses:
   *       '200':
   *         description: Aircraft Maintenance updated
   *       '400':
   *         description: Missing parameters or validation error
   *       '404':
   *         description: The Aircraft Maintenance was not found
   *       '500':
   *         description: Server error
   */
  async update({ request, response }: HttpContext) {
    try {
      const aircraftMaintenanceId = request.param('id')
      if (!aircraftMaintenanceId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Aircraft Maintenance ID not found',
          message: 'Missing data to process',
          data: { aircraftMaintenanceId },
        }
      }
      await request.validateUsing(createAircraftMaintenanceValidator)
      let aircraftMaintenanceStartDate = request.input('aircraftMaintenanceStartDate')
      aircraftMaintenanceStartDate = (
        aircraftMaintenanceStartDate.split('T')[0] +
        ' ' +
        aircraftMaintenanceStartDate.split('T')[1].split('.')[0]
      ).replace('"', '')
      let aircraftMaintenanceFinishDate = request.input('aircraftMaintenanceFinishDate')
      if (aircraftMaintenanceFinishDate) {
        aircraftMaintenanceFinishDate = (
          aircraftMaintenanceFinishDate.split('T')[0] +
          ' ' +
          aircraftMaintenanceFinishDate.split('T')[1].split('.')[0]
        ).replace('"', '')
      }

      let aircraftMaintenanceEndDate = request.input('aircraftMaintenanceEndDate')
      aircraftMaintenanceEndDate = (
        aircraftMaintenanceEndDate.split('T')[0] +
        ' ' +
        aircraftMaintenanceEndDate.split('T')[1].split('.')[0]
      ).replace('"', '')
      // Creamos el objeto parcial para la nueva reservación
      const aircraftMaintenanceData = {
        aircraftId: request.input('aircraftId'),
        maintenanceTypeId: request.input('maintenanceTypeId'),
        aircraftMaintenanceStartDate,
        aircraftMaintenanceEndDate,
        aircraftMaintenanceFinishDate,
        maintenanceUrgencyLevelId: request.input('maintenanceUrgencyLevelId'),
        aircraftMaintenanceStatusId: request.input('aircraftMaintenanceStatusId'),
        aircraftMaintenanceNotes: request.input('aircraftMaintenanceNotes'),
      } as AircraftMaintenance

      // Verificamos si existe la reservación
      const currentAircraftMaintenance = await AircraftMaintenance.query()
        .whereNull('aircraft_maintenance_deleted_at')
        .where('aircraft_maintenance_id', aircraftMaintenanceId)
        .first()

      if (!currentAircraftMaintenance) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The aircraft maintenance was not found',
          message: 'No aircraft maintenance found with the entered ID',
          data: { aircraftMaintenanceId },
        }
      }

      // Pasamos por un service que verifique la info (opcional)
      const aircraftMaintenanceService = new AircraftMaintenanceService()
      const valid = await aircraftMaintenanceService.verifyInfo(
        aircraftMaintenanceData,
        aircraftMaintenanceId
      )
      if (valid.status !== 200) {
        response.status(valid.status)
        return {
          type: valid.type,
          title: valid.title,
          message: valid.message,
          data: { ...aircraftMaintenanceData },
        }
      }

      // Actualizamos la reservación
      const updatedReservation = await aircraftMaintenanceService.update(
        currentAircraftMaintenance,
        aircraftMaintenanceData
      )
      response.status(200)
      return {
        type: 'success',
        title: 'Aircraft Maintenance',
        message: 'The aircraft maintenance was updated successfully',
        data: { reservation: updatedReservation },
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }

  /**
   * @swagger
   * /api/aircraft-maintenances/{aircraftMaintenanceId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Aircraft Maintenances
   *     summary: Delete Aircraft Maintenance
   *     parameters:
   *       - in: path
   *         name: aircraftMaintenanceId
   *         schema:
   *           type: number
   *         required: true
   *     responses:
   *       '200':
   *         description: Aircraft Maintenance deleted
   *       '404':
   *         description: Aircraft Maintenance not found
   *       '500':
   *         description: Server error
   */
  async destroy({ request, response }: HttpContext) {
    try {
      const aircraftMaintenanceId = request.param('id')
      if (!aircraftMaintenanceId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Aircraft Maintenance ID not found',
          message: 'Missing data to process',
          data: { aircraftMaintenanceId },
        }
      }
      const currentAircraftMaintenance = await AircraftMaintenance.query()
        .whereNull('aircraft_maintenance_deleted_at')
        .where('aircraft_maintenance_id', aircraftMaintenanceId)
        .first()

      if (!currentAircraftMaintenance) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The aircraft maintenance was not found',
          message: 'No aircraft maintenance found with the entered ID',
          data: { aircraftMaintenanceId },
        }
      }
      const aircraftMaintenanceService = new AircraftMaintenanceService()
      const deleteAircraftMaintenance = await aircraftMaintenanceService.delete(
        currentAircraftMaintenance
      )
      if (deleteAircraftMaintenance) {
        response.status(200)
        return {
          type: 'success',
          title: 'Reservations',
          message: 'The Aircraft Maintenance was deleted successfully',
          data: { reservation: deleteAircraftMaintenance },
        }
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }

  /**
   * @swagger
   * /api/aircraft-maintenances/{aircraftMaintenanceId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Aircraft Maintenances
   *     summary: Get aircraft maintenance by id
   *     parameters:
   *       - in: path
   *         name: aircraftMaintenanceId
   *         schema:
   *           type: number
   *         required: true
   *     responses:
   *       '200':
   *         description: Aircraft Maintenances found
   *       '400':
   *         description: Missing parameters
   *       '404':
   *         description: Aircraft Maintenances not found
   *       '500':
   *         description: Server error
   */
  async show({ request, response }: HttpContext) {
    try {
      const aircraftMaintenanceId = request.param('id')
      if (!aircraftMaintenanceId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Aircraft Maintenance ID not found',
          message: 'Missing data to process',
          data: { aircraftMaintenanceId },
        }
      }
      const aircraftMaintenanceService = new AircraftMaintenanceService()
      const showAircraftMaintenance = await aircraftMaintenanceService.show(aircraftMaintenanceId)

      if (!showAircraftMaintenance) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The aircraft maintenance was not found',
          message: 'No aircraft maintenance found with the entered ID',
          data: { aircraftMaintenanceId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Aircraft Maintenance',
          message: 'The aircraft maintenance was found successfully',
          data: { reservation: showAircraftMaintenance },
        }
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
