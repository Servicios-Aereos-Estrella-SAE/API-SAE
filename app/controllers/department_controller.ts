import Department from '#models/department'
import DepartmentService from '#services/department_service'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import BiometricDepartmentInterface from '../interfaces/biometric_department_interface.js'
import Employee from '#models/employee'
import DepartmentPosition from '#models/department_position'
import DepartmentPositionService from '#services/department_position_service'
import { createDepartmentValidator, updateDepartmentValidator } from '#validators/department'
import { DepartmentShiftFilterInterface } from '../interfaces/department_shift_filter_interface.js'
import BusinessUnit from '#models/business_unit'
import { DateTime } from 'luxon'
import UserService from '#services/user_service'

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

      const businessConf = `${env.get('SYSTEM_BUSINESS')}`
      const businessList = businessConf.split(',')
      const businessUnits = await BusinessUnit.query()
        .where('business_unit_active', 1)
        .whereIn('business_unit_slug', businessList)

      const businessUnitsList = businessUnits.map((business) => business.businessUnitId)

      const department = await Department.query()
        .where('department_id', departmentId)
        .whereHas('employees', (query) => {
          query.whereIn('businessUnitId', businessUnitsList)
        })
        .first()

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
        .whereHas('position', (queryPosition) => {
          queryPosition.whereHas('employees', (query) => {
            query.whereIn('businessUnitId', businessUnitsList)
          })
        })
        .preload('position', (queryPosition) => {
          queryPosition.whereHas('employees', (query) => {
            query.whereIn('businessUnitId', businessUnitsList)
          })
        })
        .orderBy('position_id')

      response.status(200)
      return {
        type: 'successi',
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

  async getSearchPositions({ request, response }: HttpContext) {
    try {
      const departmentId = request.param('departmentId')
      const positionName = request.input('positionName') || null

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

      const positionsQuery = DepartmentPosition.query()
        .where('department_id', departmentId)
        .preload('position')

      if (positionName) {
        positionsQuery.whereHas('position', (query) => {
          query.where('positionName', 'LIKE', `%${positionName}%`)
        })
      }

      const positions = await positionsQuery.orderBy('position_id')

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
  async getAll({ auth, response }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user
      const userService = new UserService()
      let departmentsList = [] as Array<number>
      if (user) {
        departmentsList = await userService.getRoleDepartments(user.userId)
      }
      const departments = await new DepartmentService().index(departmentsList)
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

  async getOrganization({ auth, response }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user
      const userService = new UserService()
      let departmentsList = [] as Array<number>
      if (user) {
        departmentsList = await userService.getRoleDepartments(user.userId)
      }
      const departments = await new DepartmentService().buildOrganization(departmentsList)
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

  async getSearch({ auth, request, response }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user
      const userService = new UserService()
      let departments = [] as Array<number>

      if (user) {
        departments = await userService.getRoleDepartments(user.userId)
      }

      const { departmentName, page = 1, limit = 50 } = request.qs()
      const query = Department.query().orderBy('department_id')

      if (departmentName) {
        query.where('departmentName', 'LIKE', `%${departmentName}%`)
      }

      const businessConf = `${env.get('SYSTEM_BUSINESS')}`
      const businessList = businessConf.split(',')
      const businessUnits = await BusinessUnit.query()
        .where('business_unit_active', 1)
        .whereIn('business_unit_slug', businessList)

      const businessUnitsList = businessUnits.map((business) => business.businessUnitId)

      query.whereIn('businessUnitId', businessUnitsList)
      query.whereIn('departmentId', departments)

      const departmentsList = await query.paginate(page, limit)

      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resources fetched',
        data: {
          meta: {
            total: departmentsList.total,
            per_page: departmentsList.perPage,
            current_page: departmentsList.currentPage,
            last_page: departmentsList.lastPage,
            first_page: 1,
          },
          data: departmentsList.all().map((department) => department.toJSON()),
        },
      })
    } catch (error) {
      return response.status(500).json({
        type: 'error',
        title: 'Server error',
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * @swagger
   * /api/departments:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: create new department
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               departmentCode:
   *                 type: string
   *                 description: Department code
   *                 required: true
   *                 default: ''
   *               departmentName:
   *                 type: string
   *                 description: Department name
   *                 required: true
   *                 default: ''
   *               departmentAlias:
   *                 type: string
   *                 description: Department alias
   *                 required: false
   *                 default: ''
   *               departmentIsDefault:
   *                 type: boolean
   *                 description: Department if is default
   *                 required: false
   *                 default: false
   *               departmentActive:
   *                 type: boolean
   *                 description: Departmeent status
   *                 required: false
   *                 default: false
   *               parentDepartmentId:
   *                 type: number
   *                 description: Department parent id
   *                 required: false
   *                 default: ''
   *               companyId:
   *                 type: number
   *                 description: Company id
   *                 required: true
   *                 default: ''
   *     responses:
   *       '201':
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
  async store({ request, response }: HttpContext) {
    try {
      const departmentName = request.input('departmentName')
      const departmentAlias = request.input('departmentAlias')
      const departmentIsDefault = request.input('departmentIsDefault')
      const departmentActive = request.input('departmentActive')
      const parentDepartmentId = request.input('parentDepartmentId')
      const companyId = request.input('companyId')
      // get last departmentId and add 1
      const lastDepartment = await Department.query().orderBy('departmentId', 'desc').first()
      const departmentCode = (lastDepartment ? lastDepartment.departmentId + 1 : 0).toString()
      const department = {
        departmentCode: departmentCode,
        departmentName: departmentName,
        departmentAlias: departmentAlias,
        departmentIsDefault: departmentIsDefault,
        departmentActive: departmentActive,
        parentDepartmentId: parentDepartmentId,
        companyId: companyId,
      } as Department
      const departmentService = new DepartmentService()
      const data = await request.validateUsing(createDepartmentValidator)
      const exist = await departmentService.verifyInfoExist(department)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const newDepartment = await departmentService.create(department)
      if (newDepartment) {
        response.status(201)
        return {
          type: 'success',
          title: 'Departments',
          message: 'The department was created successfully',
          data: { department: newDepartment },
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
   * /api/departments/{departmentId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: update department
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: departmentId
   *         schema:
   *           type: number
   *         description: Department id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               departmentCode:
   *                 type: string
   *                 description: Department code
   *                 required: true
   *                 default: ''
   *               departmentName:
   *                 type: string
   *                 description: Department name
   *                 required: true
   *                 default: ''
   *               departmentAlias:
   *                 type: string
   *                 description: Department alias
   *                 required: false
   *                 default: ''
   *               departmentIsDefault:
   *                 type: boolean
   *                 description: Department if is default
   *                 required: false
   *                 default: false
   *               departmentActive:
   *                 type: boolean
   *                 description: Departmeent status
   *                 required: false
   *                 default: false
   *               parentDepartmentId:
   *                 type: number
   *                 description: Department parent id
   *                 required: false
   *                 default: ''
   *               companyId:
   *                 type: number
   *                 description: Company id
   *                 required: true
   *                 default: ''
   *     responses:
   *       '201':
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
  async update({ request, response }: HttpContext) {
    try {
      const departmentId = request.param('departmentId')
      const departmentCode = request.input('departmentCode')
      const departmentName = request.input('departmentName')
      const departmentAlias = request.input('departmentAlias')
      const departmentIsDefault = request.input('departmentIsDefault')
      const departmentActive = request.input('departmentActive')
      const parentDepartmentId = request.input('parentDepartmentId')
      const companyId = request.input('companyId')
      const department = {
        departmentId: departmentId,
        departmentCode: departmentCode,
        departmentName: departmentName,
        departmentAlias: departmentAlias,
        departmentIsDefault: departmentIsDefault,
        departmentActive: departmentActive,
        parentDepartmentId: parentDepartmentId,
        companyId: companyId,
      } as Department
      if (!departmentId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The department Id was not found',
          message: 'Missing data to process',
          data: { ...department },
        }
      }
      const currentDepartment = await Department.query()
        .whereNull('department_deleted_at')
        .where('department_id', departmentId)
        .first()
      if (!currentDepartment) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The department was not found',
          message: 'The department was not found with the entered ID',
          data: { ...department },
        }
      }
      const departmentService = new DepartmentService()
      const data = await request.validateUsing(updateDepartmentValidator)
      const exist = await departmentService.verifyInfoExist(department)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await departmentService.verifyInfo(department)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const updateDepartment = await departmentService.update(currentDepartment, department)
      if (updateDepartment) {
        response.status(201)
        return {
          type: 'success',
          title: 'Departments',
          message: 'The department was updated successfully',
          data: { department: updateDepartment },
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
   * /api/departments/{departmentId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: delete department
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
   *       '201':
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
  // async delete({ request, response }: HttpContext) {
  //   try {
  //     const departmentId = request.param('departmentId')
  //     if (!departmentId) {
  //       response.status(400)
  //       return {
  //         type: 'warning',
  //         title: 'The department Id was not found',
  //         message: 'Missing data to process',
  //         data: { departmentId },
  //       }
  //     }
  //     const currentDepartment = await Department.query()
  //       .whereNull('department_deleted_at')
  //       .where('department_id', departmentId)
  //       .first()
  //     if (!currentDepartment) {
  //       response.status(404)
  //       return {
  //         type: 'warning',
  //         title: 'The department was not found',
  //         message: 'The department was not found with the entered ID',
  //         data: { departmentId },
  //       }
  //     }
  //     const departmentService = new DepartmentService()
  //     const deleteDepartment = await departmentService.delete(currentDepartment)
  //     if (deleteDepartment) {
  //       response.status(201)
  //       return {
  //         type: 'success',
  //         title: 'Departments',
  //         message: 'The department was deleted successfully',
  //         data: { department: deleteDepartment },
  //       }
  //     }
  //   } catch (error) {
  //     response.status(500)
  //     return {
  //       type: 'error',
  //       title: 'Server error',
  //       message: 'An unexpected error has occurred on the server',
  //       error: error.message,
  //     }
  //   }
  // }
  async delete({ request, response }: HttpContext) {
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
      const currentDepartment = await Department.query()
        .whereNull('department_deleted_at')
        .where('department_id', departmentId)
        .first()

      if (!currentDepartment) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The department was not found',
          message: 'The department was not found with the entered ID',
          data: { departmentId },
        }
      }
      const relatedEmployeesCount = await currentDepartment
        .related('employees')
        .query()
        .whereNull('employee_deleted_at')
        .count('* as total')
      const totalEmployees = relatedEmployeesCount[0].$extras.total
      if (totalEmployees > 0) {
        response.status(206)
        return {
          type: 'warning',
          title: 'Department has related employees',
          message: 'The department cannot be deleted because it has related employees',
          data: { departmentId, totalEmployees },
        }
      }
      const departmentService = new DepartmentService()
      const deleteDepartment = await departmentService.delete(currentDepartment)
      if (deleteDepartment) {
        response.status(201)
        return {
          type: 'success',
          title: 'Departments',
          message: 'The department was deleted successfully',
          data: { department: deleteDepartment },
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

  async forceDelete({ request, response }: HttpContext) {
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
      const currentDepartment = await Department.query()
        .whereNull('department_deleted_at')
        .where('department_id', departmentId)
        .first()
      if (!currentDepartment) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The department was not found',
          message: 'The department was not found with the entered ID',
          data: { departmentId },
        }
      }
      const employees = await currentDepartment
        .related('employees')
        .query()
        .whereNull('employee_deleted_at')

      if (employees.length > 0) {
        const newDepartmentId = 999
        for (const employee of employees) {
          employee.departmentId = newDepartmentId
          await employee.save()
          const currentPositions = await DepartmentPosition.query().where(
            'department_id',
            departmentId
          )
          if (currentPositions.length > 0) {
            for (const position of currentPositions) {
              position.departmentId = newDepartmentId
              await position.save()
              const positionEmployees = await Employee.query()
                .where('department_id', departmentId)
                .andWhere('position_id', position.positionId)
              if (positionEmployees.length > 0) {
                for (const posEmployee of positionEmployees) {
                  posEmployee.departmentId = newDepartmentId
                  posEmployee.positionId = position.positionId
                  await posEmployee.save()
                }
              }
            }
          }
        }
      }
      currentDepartment.deletedAt = DateTime.now()
      await currentDepartment.save()
      response.status(201)
      return {
        type: 'success',
        title: 'Departments',
        message:
          'The department, its related positions, and employees were reassigned successfully and the department was soft deleted',
        data: { department: currentDepartment },
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

  /**
   * @swagger
   * /api/department/assign-shift/{departmentId}:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments
   *     summary: assign shift to employees by department
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: departmentId
   *         schema:
   *           type: number
   *         description: Department id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               shiftId:
   *                 type: number
   *                 description: Shift id
   *                 required: true
   *                 default: ''
   *               applySince:
   *                 type: string
   *                 format: date
   *                 description: Apply since (YYYY-MM-DD HH:mm:ss)
   *                 required: true
   *                 default: ''
   *     responses:
   *       '201':
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
  async assignShift({ request, response }: HttpContext) {
    try {
      const departmentId = request.param('departmentId')
      const shiftId = request.input('shiftId')
      const applySince = request.input('applySince')
      const departmentShiftFilterInterface = {
        departmentId: departmentId,
        shiftId: shiftId,
        applySince: applySince,
      } as DepartmentShiftFilterInterface

      const departmentService = new DepartmentService()
      const isValidInfo = await departmentService.verifyInfoAssignShift(
        departmentShiftFilterInterface
      )
      if (isValidInfo.status !== 200) {
        return {
          status: isValidInfo.status,
          type: isValidInfo.type,
          title: isValidInfo.title,
          message: isValidInfo.message,
          data: isValidInfo.data,
        }
      }
      const assignDepartment = await departmentService.assignShift(departmentShiftFilterInterface)
      if (assignDepartment.status === 201) {
        response.status(201)
        return {
          type: 'success',
          title: 'Departments',
          message: 'The shift was assign to department successfully',
          data: { department: assignDepartment },
        }
      } else {
        return {
          status: assignDepartment.status,
          type: assignDepartment.type,
          title: assignDepartment.title,
          message: assignDepartment.message,
          data: {},
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
