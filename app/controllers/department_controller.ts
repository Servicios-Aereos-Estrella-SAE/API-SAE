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
   *       - Departamentos
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
   *               deptCode:
   *                 type: string
   *                 description: Código de departamento para filtrar
   *                 required: false
   *                 default: ''
   *               deptName:
   *                 required: false
   *                 description: Nombre de departamento para filtrar
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
          title: 'Sincronización de departamentos',
          message: 'Se han sincronizado los departamentos correctamente',
          data: {
            data,
          },
        }
      } else {
        response.status(404)
        return {
          type: 'warning',
          title: 'Sincronización de departamentos',
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
   *         description: Error inesperado
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
   * /api/departments/{departmentId}/get-positions:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: get positions
   *     parameters:
   *       - name: departmentId
   *         in: query
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
   *         description: Error inesperado
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
      const departmentId = request.input('departmentId')
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
