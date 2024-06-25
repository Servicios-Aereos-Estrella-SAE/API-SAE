import Employee from '#models/employee'
import EmployeeService from '#services/employee_service'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import BiometricEmployeeInterface from '../interfaces/biometric_employee_interface.js'
import DepartmentService from '#services/department_service'
import PositionService from '#services/position_service'
import { createEmployeeValidator } from '../validators/employee.js'
import { updateEmployeeValidator } from '../validators/employee.js'

export default class EmployeeController {
  /**
   * @swagger
   * /api/synchronization/employees:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
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
   *                 default: 300
   *               empCode:
   *                 type: string
   *                 description: The employee code to filter by
   *                 required: false
   *                 default: ''
   *               firstName:
   *                 type: string
   *                 description: The first name to filter by
   *                 required: false
   *                 default: ''
   *               lastName:
   *                 type: string
   *                 description: The last name to filter by
   *                 required: false
   *                 default: ''
   *               depName:
   *                 type: string
   *                 description: The employee name to filter by
   *                 required: false
   *                 default: ''
   *               positionName:
   *                 type: string
   *                 description: The position name to filter by
   *                 required: false
   *                 default: ''
   *               depCode:
   *                 type: string
   *                 description: The employee code to filter by
   *                 required: false
   *                 default: ''
   *               positionCode:
   *                 type: string
   *                 description: The position code to filter by
   *                 required: false
   *                 default: ''
   *               employeeId:
   *                 type: integer
   *                 description: The employee id to filter by
   *                 required: false
   *                 default: 0
   *               positionId:
   *                 type: integer
   *                 description: The position id to filter by
   *                 required: false
   *                 default: 0
   *               hireDate:
   *                 type: string
   *                 format: date
   *                 description: The hire date to filter by format year month day
   *                 required: false
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
  async synchronization({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 300)
      const empCode = request.input('empCode')
      const firstName = request.input('firstName')
      const lastName = request.input('lastName')
      const depName = request.input('depName')
      const positionName = request.input('positionName')
      const depCode = request.input('depCode')
      const positionCode = request.input('positionCode')
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const hireDate = request.input('hireDate')

      let apiUrl = `${env.get('API_BIOMETRICS_HOST')}/employees`
      apiUrl = `${apiUrl}?page=${page || ''}`
      apiUrl = `${apiUrl}&limit=${limit || ''}`
      apiUrl = `${apiUrl}&empCode=${empCode || ''}`
      apiUrl = `${apiUrl}&firstName=${firstName || ''}`
      apiUrl = `${apiUrl}&lastName=${lastName || ''}`
      apiUrl = `${apiUrl}&depName=${depName || ''}`
      apiUrl = `${apiUrl}&positionName=${positionName || ''}`
      apiUrl = `${apiUrl}&depCode=${depCode || ''}`
      apiUrl = `${apiUrl}&positionCode=${positionCode || ''}`
      apiUrl = `${apiUrl}&departmentId=${departmentId || ''}`
      apiUrl = `${apiUrl}&positionId=${positionId || ''}`
      apiUrl = `${apiUrl}&hireDate=${hireDate || ''}`
      const apiResponse = await axios.get(apiUrl)
      const data = apiResponse.data.data
      if (data) {
        const employeeService = new EmployeeService()
        const departmentService = new DepartmentService()
        const positionService = new PositionService()
        data.sort((a: BiometricEmployeeInterface, b: BiometricEmployeeInterface) => a.id - b.id)
        for await (const employee of data) {
          await this.verify(employee, employeeService, departmentService, positionService)
        }
        response.status(200)
        return {
          type: 'success',
          title: 'Employee synchronization',
          message: 'Employees have been synchronized successfully',
          data: {
            data,
          },
        }
      } else {
        response.status(404)
        return {
          type: 'warning',
          title: 'Employee synchronization',
          message: 'No data found to synchronize',
          data: { data },
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
   * /api/employees:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: get all
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
   *         description: The page number for pagination
   *         schema:
   *           type: integer
   *       - name: limit
   *         in: query
   *         required: true
   *         description: The number of records per page
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
  async getAll({ request, response }: HttpContext) {
    try {
      const search = request.input('search')
      const department = request.input('department')
      const position = request.input('position')
      const page = request.input('page', 1)
      const limit = request.input('limit', 100)

      const employees = await Employee.query()
        .if(search, (query) => {
          query.whereRaw('UPPER(CONCAT(employee_first_name, " ", employee_last_name)) LIKE ?', [
            `%${search.toUpperCase()}%`,
          ])
          query.orWhereRaw('UPPER(employee_code) = ?', [`${search.toUpperCase()}`])
        })
        .if(department && position, (query) => {
          query.where('department_id', department)
          query.where('position_id', position)
        })
        .preload('department')
        .preload('position')
        .orderBy('employee_id')
        .paginate(page, limit)

      response.status(200)
      return {
        type: 'success',
        title: 'Employees',
        message: 'The employees were found successfully',
        data: {
          employees,
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
   * /api/employees:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: create new employee
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               employeeFirstName:
   *                 type: string
   *                 description: Employe first name
   *                 required: false
   *                 default: ''
   *               employeeLastName:
   *                 type: string
   *                 description: Employee last name
   *                 required: false
   *                 default: ''
   *               employeeSecondLastName:
   *                 type: string
   *                 description: Employee second last name
   *                 required: false
   *                 default: ''
   *               employeeCode:
   *                 type: string
   *                 description: Employee code
   *                 required: true
   *                 default: ''
   *               employeePayrollNum:
   *                 type: string
   *                 description: Employee pay roll num
   *                 required: true
   *                 default: ''
   *               employeeHireDate:
   *                 type: string
   *                 format: date
   *                 description: Employee hire date (YYYY-MM-DD)
   *                 required: true
   *                 default: ''
   *               companyId:
   *                 type: integer
   *                 description: Company id
   *                 required: true
   *                 default: 0
   *               departmentId:
   *                 type: integer
   *                 description: Department id
   *                 required: true
   *                 default: 0
   *               positionId:
   *                 type: integer
   *                 description: Position id
   *                 required: true
   *                 default: 0
   *               personId:
   *                 type: integer
   *                 description: Person id
   *                 required: true
   *                 default: 0
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
      const employeeFirstName = request.input('employeeFirstName')
      const employeeLastName = request.input('employeeLastName')
      const employeeSecondLastName = request.input('employeeSecondLastName')
      const employeeCode = request.input('employeeCode')
      const employeePayrollNum = request.input('employeePayrollNum')
      const employeeHireDate = request.input('employeeHireDate')
      const personId = request.input('personId')
      const companyId = request.input('companyId')
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const employee = {
        employeeFirstName: employeeFirstName,
        employeeLastName: `${employeeLastName}  ${employeeSecondLastName}`,
        employeeCode: employeeCode,
        employeePayrollNum: employeePayrollNum,
        employeeHireDate: employeeHireDate,
        companyId: companyId,
        departmentId: departmentId,
        positionId: positionId,
        personId: personId,
      } as Employee
      const employeeService = new EmployeeService()
      const data = await request.validateUsing(createEmployeeValidator)
      const exist = await employeeService.verifyInfoExist(employee)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const newEmployee = await employeeService.create(employee)
      if (newEmployee) {
        response.status(201)
        return {
          type: 'success',
          title: 'Employees',
          message: 'The employee was created successfully',
          data: { employee: newEmployee },
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
   * /api/employees/{employeeId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: update employee
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               employeeFirstName:
   *                 type: string
   *                 description: Employe first name
   *                 required: false
   *                 default: ''
   *               employeeLastName:
   *                 type: string
   *                 description: Employee last name
   *                 required: false
   *                 default: ''
   *               employeeSecondLastName:
   *                 type: string
   *                 description: Employee second last name
   *                 required: false
   *                 default: ''
   *               employeeCode:
   *                 type: string
   *                 description: Employee code
   *                 required: true
   *                 default: ''
   *               employeePayrollNum:
   *                 type: string
   *                 description: Employee pay roll num
   *                 required: true
   *                 default: ''
   *               employeeHireDate:
   *                 type: string
   *                 format: date
   *                 description: Employee hire date (YYYY-MM-DD)
   *                 required: true
   *                 default: ''
   *               companyId:
   *                 type: integer
   *                 description: Company id
   *                 required: true
   *                 default: 0
   *               departmentId:
   *                 type: integer
   *                 description: Department id
   *                 required: true
   *                 default: 0
   *               positionId:
   *                 type: integer
   *                 description: Position id
   *                 required: true
   *                 default: 0
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
      const employeeId = request.param('employeeId')
      const employeeFirstName = request.input('employeeFirstName')
      const employeeLastName = request.input('employeeLastName')
      const employeeSecondLastName = request.input('employeeSecondLastName')
      const employeeCode = request.input('employeeCode')
      const employeePayrollNum = request.input('employeePayrollNum')
      const employeeHireDate = request.input('employeeHireDate')
      const companyId = request.input('companyId')
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const employee = {
        employeeId: employeeId,
        employeeFirstName: employeeFirstName,
        employeeLastName: `${employeeLastName}  ${employeeSecondLastName}`,
        employeeCode: employeeCode,
        employeePayrollNum: employeePayrollNum,
        employeeHireDate: employeeHireDate,
        companyId: companyId,
        departmentId: departmentId,
        positionId: positionId,
      } as Employee
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee Id was not found',
          message: 'Missing data to process',
          data: { ...employee },
        }
      }
      const currentEmployee = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('employee_id', employeeId)
        .first()
      if (!currentEmployee) {
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { ...employee },
        }
      }
      const employeeService = new EmployeeService()
      const data = await request.validateUsing(updateEmployeeValidator)
      const exist = await employeeService.verifyInfoExist(employee)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await employeeService.verifyInfo(employee)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const updateEmployee = await employeeService.update(currentEmployee, employee)
      if (updateEmployee) {
        response.status(201)
        return {
          type: 'success',
          title: 'Employees',
          message: 'The employee was updated successfully',
          data: { employee: updateEmployee },
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
   * /api/employees/{employeeId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: delete employee
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
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
  async delete({ request, response }: HttpContext) {
    try {
      const employeeId = request.param('employeeId')
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee Id was not found',
          message: 'Missing data to process',
          data: { ...employeeId },
        }
      }
      const currentEmployee = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('employee_id', employeeId)
        .first()
      if (!currentEmployee) {
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { ...employeeId },
        }
      }
      const employeeService = new EmployeeService()
      const deleteEmployee = await employeeService.delete(currentEmployee)
      if (deleteEmployee) {
        response.status(201)
        return {
          type: 'success',
          title: 'Employees',
          message: 'The employee was deleted successfully',
          data: { employee: deleteEmployee },
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

  private async verify(
    employee: BiometricEmployeeInterface,
    employeeService: EmployeeService,
    departmentService: DepartmentService,
    positionService: PositionService
  ) {
    const existEmployee = await Employee.query().where('employee_code', employee.empCode).first()
    if (!existEmployee) {
      await employeeService.syncCreate(employee, departmentService, positionService)
    } else {
      employeeService.syncUpdate(employee, existEmployee, departmentService, positionService)
    }
  }
}
