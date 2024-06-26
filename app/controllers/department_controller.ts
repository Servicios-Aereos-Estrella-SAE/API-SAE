import Department from '#models/department'
import DepartmentService from '#services/department_service'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import BiometricDepartmentInterface from '../interfaces/biometric_department_interface.js'
import Employee from '#models/employee'
import DepartmentPosition from '#models/department_position'
import DepartmentPositionService from '#services/department_position_service'

export default class DepartmentController {
  /**
   * @swagger
   * /api/synchronization/departments:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: sync information
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
   *                 description: The page number for pagination
   *                 required: false
   *                 default: 1
   *               limit:
   *                 type: integer
   *                 description: The number of records per page
   *                 required: false
   *                 default: 200
   *               deptCode:
   *                 type: string
   *                 description: The department code to filter by
   *                 required: false
   *                 default: ''
   *               deptName:
   *                 required: false
   *                 description: The department name to filter by
   *                 type: string
   *                 default: ''
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
  async synchronization({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 200)
      const deptCode = request.input('deptCode')
      const deptName = request.input('deptName')

      let apiUrl = `${env.get('API_BIOMETRICS_HOST')}/departments`
      apiUrl = `${apiUrl}?page=${page || ''}`
      apiUrl = `${apiUrl}&limit=${limit || ''}`
      apiUrl = `${apiUrl}&deptCode=${deptCode || ''}`
      apiUrl = `${apiUrl}&deptName=${deptName || ''}`
      const apiResponse = await axios.get(apiUrl)
      const data = apiResponse.data.data
      if (data) {
        const departmentService = new DepartmentService()
        data.sort((a: BiometricDepartmentInterface, b: BiometricDepartmentInterface) => a.id - b.id)
        for await (const department of data) {
          await this.verify(department, departmentService)
        }
        response.status(200)
        return {
          type: 'success',
          title: 'Sync departments',
          message: 'Departments have been synchronized successfully',
          data: {
            data,
          },
        }
      } else {
        response.status(404)
        return {
          type: 'warning',
          title: 'Sync departments',
          message: 'No data found to synchronize',
          data: { data },
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
   * /api/departments/sync-positions:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: sync positions
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               departmentId:
   *                 type: integer
   *                 description: Department id
   *                 required: true
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
  async syncPositions({ request, response }: HttpContext) {
    try {
      const departmentId = request.input('departmentId')
      if (!departmentId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Sync positions by department',
          message: 'Missing data to process',
          data: {},
        }
      }
      const department = await Department.query().where('department_id', departmentId).first()
      if (!department) {
        response.status(404)
        return {
          type: 'warning',
          title: 'Sync positions by department',
          message: 'Department not found',
          data: { department_id: departmentId },
        }
      }
      const employees = await Employee.query()
        .distinct('position_id')
        .where('department_id', departmentId)
        .preload('position')
        .orderBy('position_id')
      const departmentPositionService = new DepartmentPositionService()
      for await (const employee of employees) {
        await this.verifyRelatedPosition(
          departmentId,
          employee.positionId,
          departmentPositionService
        )
      }
      response.status(200)
      return {
        type: 'success',
        title: 'Sync positions by department',
        message: 'The positions by department have been sync successfully',
        data: {
          department,
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

  /**
   * @swagger
   * /api/departments/{departmentId}/positions:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: get positions
   *     parameters:
   *       - name: departmentId
   *         in: path
   *         required: true
   *         description: Departmemnt id
   *         schema:
   *           type: integer
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
  async getPositions({ request, response }: HttpContext) {
    try {
      const departmentId = request.param('departmentId')
      if (!departmentId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Positions by department',
          message: 'Missing data to process',
          data: {},
        }
      }
      const department = await Department.query().where('department_id', departmentId).first()
      if (!department) {
        response.status(404)
        return {
          type: 'warning',
          title: 'Positions by department',
          message: 'Department not found',
          data: { department_id: departmentId },
        }
      }
      const positions = await DepartmentPosition.query()
        .where('department_id', departmentId)
        .preload('position')
        .orderBy('position_id')
      response.status(200)
      return {
        type: 'success',
        title: 'Positions by department',
        message: 'The positions by department have been found successfully',
        data: {
          positions,
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

  /**
   * @swagger
   * /api/departments:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: get all departments
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
  async getAll({ response }: HttpContext) {
    try {
      const departments = await Department.query()
        .has('departmentsPositions')
        .orderBy('department_id')
      response.status(200)
      return {
        type: 'success',
        title: 'Departments',
        message: 'Departments were found successfully',
        data: {
          departments,
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

  /**
   * @swagger
   * /api/departments/{departmentId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: get department by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: departmentId
   *         schema:
   *           type: number
   *         description: Department id
   *         required: true
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
  async show({ request, response }: HttpContext) {
    try {
      const departmentId = request.param('departmentId')
      if (!departmentId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The department Id was not found',
          message: 'Missing data to process',
          data: { departmentId },
        }
      }
      const departmentService = new DepartmentService()
      const showDepartment = await departmentService.show(departmentId)
      if (!showDepartment) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The department was not found',
          message: 'The department was not found with the entered ID',
          data: { departmentId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Departments',
          message: 'The department was found successfully',
          data: { department: showDepartment },
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

  private async verify(
    department: BiometricDepartmentInterface,
    departmentService: DepartmentService
  ) {
    const existDepartment = await Department.query()
      .where('department_sync_id', department.id)
      .first()
    if (!existDepartment) {
      await departmentService.syncCreate(department)
    } else {
      departmentService.syncUpdate(department, existDepartment)
    }
  }

  private async verifyRelatedPosition(
    departmentId: number,
    positionId: number,
    departmentPositionService: DepartmentPositionService
  ) {
    const existDepartmentPosition = await DepartmentPosition.query()
      .where('department_id', departmentId)
      .where('position_id', positionId)
      .first()
    if (!existDepartmentPosition) {
      await departmentPositionService.syncCreate(departmentId, positionId)
    }
  }
}
