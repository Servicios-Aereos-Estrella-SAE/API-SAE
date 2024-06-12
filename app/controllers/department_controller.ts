import Department from '#models/department'
import DepartmentService from '#services/department_service'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'

export default class UserController {
  /**
   * @swagger
   * /api/synchronization/departments:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departamentos
   *     summary: Sincronización de Información
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: page
   *         in: query
   *         required: false
   *         description: Número de pagina para paginación
   *         schema:
   *           type: integer
   *       - name: limit
   *         in: query
   *         required: false
   *         description: Número de renglones por página
   *         schema:
   *           type: integer
   *       - name: deptCode
   *         in: query
   *         required: false
   *         description: Código de departamento para filtrar
   *         schema:
   *           type: string
   *       - name: deptName
   *         in: query
   *         required: false
   *         description: Nombre de departamento para filtrar
   *         schema:
   *           type: string
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
      const limit = request.input('limit', 10)
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

  private async verify(department: any, departmentService: DepartmentService) {
    const existDepartment = await Department.query()
      .where('department_sync_id', department.id)
      .first()
    if (!existDepartment) {
      await departmentService.create(department)
    } else {
      departmentService.update(department, existDepartment)
    }
  }
}
