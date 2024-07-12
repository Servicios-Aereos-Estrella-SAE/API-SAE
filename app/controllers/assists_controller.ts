import SyncAssistsService from '#services/sync_assists_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Employee from '#models/employee'
import AssistsService from '#services/assist_service'
import { AssistEmployeeExcelFilterInterface } from '../interfaces/assist_employee_excel_filter_interface.js'
import Position from '#models/position'
import Department from '#models/department'
import { AssistPositionExcelFilterInterface } from '../interfaces/assist_position_excel_filter_interface.js'
import { AssistDepartmentExcelFilterInterface } from '../interfaces/assist_department_excel_filter_interface.js'

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
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/v1/assists/get-excel-by-employee:
   *   get:
   *     summary: get assists excel by employee
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
  async getExcelByEmployee({ request, response }: HttpContext) {
    try {
      const employeeId = request.input('employeeId')
      const filterDate = request.input('date')
      const filterDateEnd = request.input('date-end')
      const employee = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('employee_id', employeeId)
        .preload('position')
        .preload('department')
        .first()
      if (!employee) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { employeeId },
        }
      }
      const filters = {
        employeeId: employeeId,
        filterDate: filterDate,
        filterDateEnd: filterDateEnd,
      } as AssistEmployeeExcelFilterInterface
      const assistService = new AssistsService()
      const buffer = await assistService.getExcelByEmployee(employee, filters)
      if (buffer.status === 201) {
        response.header(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response.header('Content-Disposition', 'attachment; filename=datos.xlsx')
        response.status(200)
        response.send(buffer.buffer)
      } else {
        response.status(500)
        return {
          type: buffer.type,
          title: buffer.title,
          message: buffer.message,
          error: buffer.error,
        }
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
   * /api/v1/assists/get-excel-by-position:
   *   get:
   *     summary: get assists excel by position
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
   *       - name: departmentId
   *         in: query
   *         required: true
   *         schema:
   *           type: number
   *         description: Department id
   *       - name: positionId
   *         in: query
   *         required: true
   *         schema:
   *           type: number
   *         description: Position id
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
  async getExcelByPosition({ request, response }: HttpContext) {
    try {
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const filterDate = request.input('date')
      const filterDateEnd = request.input('date-end')
      const department = await Department.query()
        .whereNull('department_deleted_at')
        .where('department_id', departmentId)
        .first()
      if (!department) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The department was not found',
          message: 'The department was not found with the entered ID',
          data: { departmentId },
        }
      }
      const position = await Position.query()
        .whereNull('position_deleted_at')
        .where('position_id', positionId)
        .first()
      if (!position) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The position was not found',
          message: 'The position was not found with the entered ID',
          data: { positionId },
        }
      }
      const filters = {
        positionId: positionId,
        departmentId: departmentId,
        filterDate: filterDate,
        filterDateEnd: filterDateEnd,
      } as AssistPositionExcelFilterInterface
      const assistService = new AssistsService()
      const buffer = await assistService.getExcelByPosition(filters)
      if (buffer.status === 201) {
        response.header(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response.header('Content-Disposition', 'attachment; filename=datos.xlsx')
        response.status(200)
        response.send(buffer.buffer)
      } else {
        response.status(500)
        return {
          type: buffer.type,
          title: buffer.title,
          message: buffer.message,
          error: buffer.error,
        }
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
   * /api/v1/assists/get-excel-by-position:
   *   get:
   *     summary: get assists excel by position
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
   *       - name: departmentId
   *         in: query
   *         required: true
   *         schema:
   *           type: number
   *         description: Department id
   *       - name: positionId
   *         in: query
   *         required: true
   *         schema:
   *           type: number
   *         description: Position id
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
  async getExcelByDepartment({ request, response }: HttpContext) {
    try {
      const departmentId = request.input('departmentId')
      const filterDate = request.input('date')
      const filterDateEnd = request.input('date-end')
      const department = await Department.query()
        .whereNull('department_deleted_at')
        .where('department_id', departmentId)
        .first()
      if (!department) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The department was not found',
          message: 'The department was not found with the entered ID',
          data: { departmentId },
        }
      }
      const filters = {
        departmentId: departmentId,
        filterDate: filterDate,
        filterDateEnd: filterDateEnd,
      } as AssistDepartmentExcelFilterInterface
      const assistService = new AssistsService()
      const buffer = await assistService.getExcelByDepartment(filters)
      if (buffer.status === 201) {
        response.header(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response.header('Content-Disposition', 'attachment; filename=datos.xlsx')
        response.status(200)
        response.send(buffer.buffer)
      } else {
        response.status(500)
        return {
          type: buffer.type,
          title: buffer.title,
          message: buffer.message,
          error: buffer.error,
        }
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
