import Department from '#models/department'
import Employee from '#models/employee'
import EmployeeService from '#services/employee_service'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import BiometricEmployeeInterface from '../interfaces/biometric_employee_interface.js'
import { createEmployeeValidator } from '../validators/employee.js'
import { updateEmployeeValidator } from '../validators/employee.js'
import { EmployeeFilterSearchInterface } from '../interfaces/employee_filter_search_interface.js'
import { inject } from '@adonisjs/core'
import UploadService from '#services/upload_service'
import UserService from '#services/user_service'
import VacationSetting from '#models/vacation_setting'
import { DateTime } from 'luxon'
import ExcelJS from 'exceljs'
import ShiftException from '#models/shift_exception'
import EmployeeShift from '#models/employee_shift'
import EmployeeType from '#models/employee_type'
import BusinessUnit from '#models/business_unit'
import Position from '#models/position'

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
  async synchronization({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 1000)
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

      const businessConf = `${env.get('SYSTEM_BUSINESS')}`
      const businessList = businessConf.split(',')
      const businessUnits = await BusinessUnit.query()
        .where('business_unit_active', 1)
        .whereIn('business_unit_slug', businessList)

      const businessUnitsList = businessUnits.map((business) => business.businessUnitName)

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
      let withOutDepartmentId = null
      let withOutPositionId = null
      const department = await Department.query()
        .whereNull('department_deleted_at')
        .where('department_name', 'Sin departamento')
        .first()
      if (department) {
        withOutDepartmentId = department.departmentId
      }
      const position = await Position.query()
        .whereNull('position_deleted_at')
        .where('position_name', 'Sin posición')
        .first()
      if (position) {
        withOutPositionId = position.positionId
      }
      if (data) {
        const employeeService = new EmployeeService()
        data.sort((a: BiometricEmployeeInterface, b: BiometricEmployeeInterface) => a.id - b.id)

        let employeeCountSaved = 0
        for await (const employee of data) {
          let existInBusinessUnitList = false
          if (employee.payrollNum) {
            if (businessUnitsList.includes(employee.payrollNum)) {
              existInBusinessUnitList = true
            }
          } else if (employee.personnelEmployeeArea.length > 0) {
            for await (const personnelEmployeeArea of employee.personnelEmployeeArea) {
              if (personnelEmployeeArea.personnelArea) {
                if (businessUnitsList.includes(personnelEmployeeArea.personnelArea.areaName)) {
                  existInBusinessUnitList = true
                  break
                }
              }
            }
          }
          if (existInBusinessUnitList) {
            employee.departmentId = withOutDepartmentId
            employee.positionId = withOutPositionId
            employeeCountSaved += 1
            await this.verify(employee, employeeService)
          }
        }
        response.status(201)
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
   *       - name: departmentId
   *         in: query
   *         required: false
   *         description: DepartmentId
   *         schema:
   *           type: integer
   *       - name: positionId
   *         in: query
   *         required: false
   *         description: PositionId
   *         schema:
   *           type: integer
   *       - name: employeeWorkSchedule
   *         in: query
   *         required: false
   *         description: Employee work schedule
   *         schema:
   *           type: string
   *       - name: onlyInactive
   *         in: query
   *         required: false
   *         description: Include only inactive
   *         default: false
   *         schema:
   *           type: boolean
   *       - name: employeeTypeId
   *         in: query
   *         required: false
   *         description: Employee Type Id
   *         schema:
   *           type: integer
   *       - name: page
   *         in: query
   *         required: true
   *         description: The page number for pagination
   *         default: 1
   *         schema:
   *           type: integer
   *       - name: limit
   *         in: query
   *         required: true
   *         description: The number of records per page
   *         default: 100
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
  async index({ auth, request, response }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user
      const userService = new UserService()
      let departmentsList = [] as Array<number>
      if (user) {
        departmentsList = await userService.getRoleDepartments(user.userId)
      }
      const search = request.input('search')
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const employeeWorkSchedule = request.input('employeeWorkSchedule')
      const onlyInactive = request.input('onlyInactive')
      const employeeTypeId = request.input('employeeTypeId')
      const page = request.input('page', 1)
      const limit = request.input('limit', 100)
      const filters = {
        search: search,
        departmentId: departmentId,
        positionId: positionId,
        employeeWorkSchedule: employeeWorkSchedule,
        onlyInactive: onlyInactive,
        employeeTypeId: employeeTypeId,
        page: page,
        limit: limit,
      } as EmployeeFilterSearchInterface
      const employeeService = new EmployeeService()
      const employees = await employeeService.index(filters, departmentsList)
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
   *               businessUnitId:
   *                 type: integer
   *                 description: Business unit id
   *                 required: true
   *                 default: 1
   *               employeeAssistDiscriminator:
   *                 type: boolean
   *                 description: If true, the employee is not considered on attendance monitor
   *                 required: true
   *                 default: 0
   *               employeeWorkSchedule:
   *                 type: string
   *                 description: Work Schedule Onsite or Remote
   *                 required: true
   *                 default: 'Onsite'
   *               employeeTypeId:
   *                 type: integer
   *                 description: Employee type id
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
      const employeeCode = request.input('employeeCode')
      const employeePayrollNum = request.input('employeePayrollNum')
      let employeeHireDate = request.input('employeeHireDate')
      employeeHireDate = (employeeHireDate.split('T')[0] + ' 00:000:00').replace('"', '')
      const personId = request.input('personId')
      const companyId = request.input('companyId')
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const workSchedule = request.input('employeeWorkSchedule')
      const employeeTypeId = request.input('employeeTypeId')
      const employee = {
        employeeId: 0,
        employeeFirstName: employeeFirstName,
        employeeLastName: `${employeeLastName}`,
        employeeCode: employeeCode,
        employeePayrollNum: employeePayrollNum,
        employeeHireDate: employeeHireDate,
        companyId: companyId,
        departmentId: departmentId,
        positionId: positionId,
        personId: personId,
        businessUnitId: request.input('businessUnitId'),
        employeeWorkSchedule: workSchedule,
        employeeTypeId: employeeTypeId,
        employeeAssistDiscriminator: request.input('employeeAssistDiscriminator'),
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
   *         description: Employee id
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
   *               businessUnitId:
   *                 type: integer
   *                 description: Business unit id
   *                 required: true
   *                 default: 1
   *               employeeAssistDiscriminator:
   *                 type: boolean
   *                 description: If true, the employee is not considered on attendance monitor
   *                 required: true
   *                 default: 0
   *               employeeWorkSchedule:
   *                 type: string
   *                 description: Work Schedule Onsite or Remote
   *                 required: true
   *                 default: 'Onsite'
   *               employeeTypeId:
   *                 type: integer
   *                 description: Employee type id
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
      const employeeCode = request.input('employeeCode')
      const employeePayrollNum = request.input('employeePayrollNum')
      let employeeHireDate = request.input('employeeHireDate')
      employeeHireDate = (employeeHireDate.split('T')[0] + ' 00:000:00').replace('"', '')
      const companyId = request.input('companyId')
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const employeeWorkSchedule = request.input('employeeWorkSchedule')
      const employeeTypeId = request.input('employeeTypeId')
      const employee = {
        employeeId: employeeId,
        employeeFirstName: employeeFirstName,
        employeeLastName: `${employeeLastName}`,
        employeeCode: employeeCode,
        employeePayrollNum: employeePayrollNum,
        employeeHireDate: employeeHireDate,
        companyId: companyId,
        departmentId: departmentId,
        positionId: positionId,
        businessUnitId: request.input('businessUnitId'),
        employeeWorkSchedule: employeeWorkSchedule,
        employeeTypeId: employeeTypeId,
        employeeAssistDiscriminator: request.input('employeeAssistDiscriminator'),
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
        response.status(404)
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
   *         description: Employee id
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
          data: { employeeId },
        }
      }
      const currentEmployee = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('employee_id', employeeId)
        .first()
      if (!currentEmployee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { employeeId },
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

  /**
   * @swagger
   * /api/employees/{employeeId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: get employee by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         description: Employee id
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
      const employeeId = request.param('employeeId')
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee Id was not found',
          message: 'Missing data to process',
          data: { employeeId },
        }
      }
      const employeeService = new EmployeeService()
      const showEmployee = await employeeService.show(employeeId)
      if (!showEmployee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { employeeId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Employees',
          message: 'The employee was found successfully',
          data: { employee: showEmployee },
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
   * /api/employees/get-by-code/{employeeCode}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: get employee by code
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeCode
   *         schema:
   *           type: string
   *         description: Employee code
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
  async getByCode({ request, response }: HttpContext) {
    try {
      const employeeCode = request.param('employeeCode')
      if (!employeeCode) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The employee code was not found',
          data: { employeeCode },
        }
      }
      const employeeService = new EmployeeService()
      const showEmployee = await employeeService.getByCode(employeeCode)
      if (!showEmployee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered code',
          data: { employeeCode },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Employees',
          message: 'The employee was found successfully',
          data: { employee: showEmployee },
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
   * /api/employees/without-user:
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
   *       - name: departmentId
   *         in: query
   *         required: false
   *         description: DepartmentId
   *         schema:
   *           type: integer
   *       - name: positionId
   *         in: query
   *         required: false
   *         description: PositionId
   *         schema:
   *           type: integer
   *       - name: page
   *         in: query
   *         required: true
   *         description: The page number for pagination
   *         default: 1
   *         schema:
   *           type: integer
   *       - name: limit
   *         in: query
   *         required: true
   *         description: The number of records per page
   *         default: 100
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
  async indexWithOutUser({ request, response }: HttpContext) {
    try {
      const search = request.input('search')
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const page = request.input('page', 1)
      const limit = request.input('limit', 100)
      const filters = {
        search: search,
        departmentId: departmentId,
        positionId: positionId,
        page: page,
        limit: limit,
      } as EmployeeFilterSearchInterface
      const employeeService = new EmployeeService()
      const employees = await employeeService.indexWithOutUser(filters)
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
   * /api/employees/{employeeId}/photo:
   *   put:
   *     summary: Upload a photo for an employee
   *     tags:
   *       - Employees
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the employee
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               photo:
   *                 type: string
   *                 format: binary
   *                 description: The photo file to upload
   *     responses:
   *       200:
   *         description: Photo uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 url:
   *                   type: string
   *                   description: URL of the uploaded photo
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *                 error:
   *                   type: object
   *                   description: Error details
   */
  @inject()
  async uploadPhoto(
    { request, response }: HttpContext,
    uploadService: UploadService,
    employeeService: EmployeeService
  ) {
    const validationOptions = {
      types: ['image'],
      size: '2mb',
    }
    const employeeId = request.param('employeeId')
    const photo = request.file('photo', validationOptions)
    // validate file required
    if (!photo) {
      return response.status(400).send({ message: 'Please upload a photo' })
    }

    const currentEmployee = await Employee.query().where('employee_id', employeeId).first()
    if (!currentEmployee) {
      return response.status(404).send({ message: 'Employee not found' })
    }
    // get file name and extension
    const fileName = `${new Date().getTime()}_${photo.clientName}`

    // get employee and update employee photo
    try {
      const photoUrl = await uploadService.fileUpload(photo, 'employees', fileName)
      if (currentEmployee.employeePhoto) {
        await uploadService.deleteFile(currentEmployee.employeePhoto)
      }
      const employee = await employeeService.updateEmployeePhotoUrl(employeeId, photoUrl)
      return response.status(200).send({ url: photoUrl, employee })
    } catch (error) {
      return response.status(500).send({ message: 'Error uploading file', error })
    }
  }

  /**
   * @swagger
   * /api/employees/get-work-schedules:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: get all work schedules
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
  async getWorkSchedules({ response }: HttpContext) {
    try {
      const employeeService = new EmployeeService()
      const employeeWorkSchedules = await employeeService.getWorkSchedules()
      response.status(200)
      return {
        type: 'success',
        title: 'Employee work schedules',
        message: 'The employee work schedules were found successfully',
        data: {
          employeeWorkSchedules,
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
   * /api/employees/{employeeId}/proceeding-files:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: get proceeding files by employee id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         description: Employee id
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
  async getProceedingFiles({ request, response }: HttpContext) {
    try {
      const employeeId = request.param('employeeId')
      const fileType = Number.parseInt(request.input('type'))

      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee Id was not found',
          message: 'Missing data to process',
          data: { employeeId },
        }
      }

      const employeeService = new EmployeeService()
      const showEmployee = await employeeService.show(employeeId)

      if (!showEmployee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { employeeId },
        }
      }

      const proceedingFiles = await employeeService.getProceedingFiles(employeeId, fileType)

      response.status(200)
      return {
        type: 'success',
        title: 'Employees',
        message: 'The proceeding files were found successfully',
        data: { data: proceedingFiles },
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
   * /api/employees/{employeeId}/get-vacations-used:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: get vacations used in current period by employee id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         description: Employee id
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
  async getVacationsUsed({ request, response }: HttpContext) {
    try {
      const employeeId = request.param('employeeId')
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee Id was not found',
          message: 'Missing data to process',
          data: { employeeId },
        }
      }
      const employeeService = new EmployeeService()
      const employee = await employeeService.show(employeeId)
      if (!employee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { employeeId },
        }
      }
      const vacations = await employeeService.getVacationsUsed(employee)
      if (vacations.status === 200) {
        response.status(vacations.status)
        return {
          type: 'success',
          title: 'Employees',
          message: 'The vacations used were found successfully',
          data: { vacations: vacations.data },
        }
      } else {
        response.status(vacations.status)
        return {
          type: vacations.type,
          title: vacations.title,
          message: vacations.message,
          data: { vacations: 0 },
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
   * /api/employees/{employeeId}/get-vacations-corresponding:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: get vacations corresponding in current period by employee id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         description: Employee id
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
  async getVacationsCorresponding({ request, response }: HttpContext) {
    try {
      const employeeId = request.param('employeeId')
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee Id was not found',
          message: 'Missing data to process',
          data: { employeeId },
        }
      }
      const employeeService = new EmployeeService()
      const employee = await employeeService.show(employeeId)
      if (!employee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { employeeId },
        }
      }
      const vacations = await employeeService.getDaysVacationsCorresponing(employee)
      if (vacations.status === 200) {
        response.status(vacations.status)
        return {
          type: 'success',
          title: 'Employees',
          message: 'The vacations corresponding were found successfully',
          data: { vacations: vacations.data },
        }
      } else {
        response.status(vacations.status)
        return {
          type: vacations.type,
          title: vacations.title,
          message: vacations.message,
          data: { vacations: 0 },
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
   * /api/employees/{employeeId}/get-years-worked:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: get years workedin by employee id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         description: Employee id
   *         required: true
   *       - name: year
   *         in: query
   *         required: false
   *         description: Year
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
  async getYearsWorked({ request, response }: HttpContext) {
    try {
      const employeeId = request.param('employeeId')
      const year = request.input('year')
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee Id was not found',
          message: 'Missing data to process',
          data: { employeeId },
        }
      }
      const employeeService = new EmployeeService()
      const employee = await employeeService.show(employeeId)
      if (!employee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { employeeId },
        }
      }
      const yearsWorked = await employeeService.getYearsWorked(employee, year)
      if (yearsWorked.status === 200) {
        response.status(yearsWorked.status)
        return {
          type: 'success',
          title: 'Employees',
          message: 'The years worked were found successfully',
          data: { yearsWorked: yearsWorked.data },
        }
      } else {
        response.status(yearsWorked.status)
        return {
          type: yearsWorked.type,
          title: yearsWorked.title,
          message: yearsWorked.message,
          data: { yearsWorked: 0 },
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
   * /api/employees/{employeeId}/get-vacations-by-period:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: get years workedin by employee id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         description: Employee id
   *         required: true
   *       - name: vacationSettingId
   *         in: query
   *         required: true
   *         description: Vacation Setting Id
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
  async getVacationsByPeriod({ request, response }: HttpContext) {
    try {
      const employeeId = request.param('employeeId')
      const vacationSettingId = request.input('vacationSettingId')
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The employee Id was not found',
          data: { employeeId },
        }
      }
      const employeeService = new EmployeeService()
      const employee = await employeeService.show(employeeId)
      if (!employee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { employeeId },
        }
      }
      if (!vacationSettingId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The vacation setting id was not found',
          data: { vacationSettingId },
        }
      }
      const employeeType = await EmployeeType.query()
        .whereNull('employee_type_deleted_at')
        .where('employee_type_id', employee.employeeTypeId)
        .first()
      let employeeIsCrew = false
      if (employeeType) {
        if (
          employeeType.employeeTypeSlug === 'pilot' ||
          employeeType.employeeTypeSlug === 'flight-attendant'
        ) {
          employeeIsCrew = true
        }
      }
      const vacationSetting = await VacationSetting.query()
        .where('vacation_setting_id', vacationSettingId)
        .whereNull('vacation_setting_deleted_at')
        .if(employeeIsCrew, (query) => {
          query.where('vacation_setting_crew', 1)
        })
      if (!vacationSetting) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The vacation setting was not found',
          message: 'The vacation setting was not found with the entered ID',
          data: { vacationSettingId },
        }
      }
      const vacations = await employeeService.getVacationsByPeriod(
        employee.employeeId,
        vacationSettingId
      )
      response.status(200)
      return {
        type: 'success',
        title: 'Employees',
        message: 'The vacations were found successfully',
        data: { vacations: vacations },
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
   * /api/employees/employee-generate-excel:
   *   get:
   *     tags:
   *       - Employees
   *     summary: Generate an Excel report of employees
   *     parameters:
   *       - in: query
   *         name: departmentId
   *         schema:
   *           type: integer
   *         description: ID of the department to filter
   *       - in: query
   *         name: employeeId
   *         schema:
   *           type: integer
   *         description: ID of the employee to filter
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for filtering
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for filtering
   *     responses:
   *       200:
   *         description: Excel file generated successfully
   *       404:
   *         description: No employees found
   *       500:
   *         description: Error generating Excel file
   */
  async getExcel({ request, response }: HttpContext) {
    try {
      const businessConf = `${env.get('SYSTEM_BUSINESS')}`
      const businessList = businessConf.split(',')
      const businessUnits = await BusinessUnit.query()
        .where('business_unit_active', 1)
        .whereIn('business_unit_slug', businessList)
      const businessUnitsList = businessUnits.map((business) => business.businessUnitId)
      const filterDepartmentId = request.qs().departmentId
      const filterEmployeeId = request.qs().employeeId
      const filterStartDate = request.qs().startDate
      const filterEndDate = request.qs().endDate

      let query = Employee.query().whereNull('employee_deleted_at')

      if (filterDepartmentId) {
        query = query.where('departmentId', filterDepartmentId)
      }

      if (filterEmployeeId) {
        query = query.where('employeeId', filterEmployeeId)
      }

      if (filterStartDate && filterEndDate) {
        const startDate = DateTime.fromISO(filterStartDate)
        const endDate = DateTime.fromISO(filterEndDate)
        const startDateSQL = startDate?.toSQLDate()
        const endDateSQL = endDate?.toSQLDate()

        if (startDateSQL && endDateSQL) {
          query = query.whereBetween('employeeHireDate', [startDateSQL, endDateSQL])
        }
      }

      const employees = await query
        .whereIn('businessUnitId', businessUnitsList)
        .preload('department')
        .preload('position')
        .preload('person')
        .exec()
      if (employees.length === 0) {
        return response.status(404).send({
          message: 'No employees found',
        })
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Employee Report')
      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 139, height: 49 },
      })
      worksheet.getRow(1).height = 60
      worksheet.mergeCells('A1:F1')

      // Agregar título
      const titleRow = worksheet.addRow(['Employee Report'])
      let titleColor = '244062'
      let titleFgColor = 'FFFFFFFF'
      titleRow.font = { bold: true, size: 24, color: { argb: titleFgColor } }
      titleRow.height = 42
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:K2')
      worksheet.getCell('A2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: titleColor },
      }
      // Agregar fila de periodos
      const periodRow = worksheet.addRow([''])
      periodRow.font = { size: 15, color: { argb: titleFgColor } }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A3:K3')
      let periodColor = '366092'
      worksheet.getCell('A3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: periodColor },
      }
      this.addHeadRow(worksheet, employees)

      for (const employee of employees) {
        const department = await Department.find(employee.departmentId)
        const departmentName = department?.departmentName || 'N/A'
        const hireDate = employee.employeeHireDate.toFormat('yyyy-MM-dd')
        worksheet.addRow({
          employeeId: employee.employeeId,
          employeeFirstName: employee.employeeFirstName,
          employeeLastName: employee.employeeLastName,
          departmentName,
          positionName: employee.positionId,
          employeeHireDate: hireDate,
        })
      }
      this.addRowExcelEmpty(worksheet)

      const buffer = await workbook.xlsx.writeBuffer()

      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      response.header('Content-Disposition', 'attachment; filename=employees.xlsx')
      response.status(201).send(buffer)
    } catch (error) {
      response.status(500).send({
        message: 'Error generating Excel file',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/employees/{employeeId}/reactivate:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees
   *     summary: reactivate employee
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         description: Employee id
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
  async reactivate({ request, response }: HttpContext) {
    try {
      const employeeId = request.param('employeeId')
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The employee Id was not found',
          data: { ...request.all() },
        }
      }
      const currentEmployee = await Employee.query()
        .whereNotNull('employee_deleted_at')
        .where('employee_id', employeeId)
        .withTrashed()
        .first()
      if (!currentEmployee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee was not found',
          message: 'The employee was not found with the entered ID',
          data: { employeeId },
        }
      }
      currentEmployee.deletedAt = null
      await currentEmployee.save()
      response.status(200)
      return {
        type: 'success',
        title: 'Employees',
        message: 'The employee was reactivate successfully',
        data: { employee: currentEmployee },
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
   * /api/employees/{employeeId}/export-excel:
   *   get:
   *     summary: Export shift exceptions of an employee to Excel
   *     description: Generates an Excel file containing shift exceptions for a specific employee, filtered by hire date and current date. Excludes exceptions of type "Día de descanso".
   *     tags:
   *       - Employees
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the employee
   *     responses:
   *       201:
   *         description: Excel file generated successfully
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       500:
   *         description: Error generating Excel file
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 error:
   *                   type: string
   */
  async exportShiftExceptionsToExcel({ params, response }: HttpContext) {
    try {
      const employeeId = params.employeeId

      const employee = await Employee.query()
        .where('employeeId', employeeId)
        .preload('department')
        .preload('position')
        .preload('shift_exceptions', (shiftExceptionsQuery) => {
          shiftExceptionsQuery.whereNull('shift_exceptions_deleted_at')
        })
        .firstOrFail()

      const hireDate =
        employee.employeeHireDate instanceof DateTime
          ? employee.employeeHireDate.toJSDate()
          : new Date(employee.employeeHireDate)
      const currentDate = DateTime.local().toJSDate()

      const shiftExceptions = await ShiftException.query()
        .where('employeeId', employeeId)
        .whereBetween('shiftExceptionsDate', [hireDate, currentDate])
        .whereNot('exception_type_id', 9)
        .preload('exceptionType')
      // Obtener los turnos asignados al empleado durante el periodo
      const employeeShifts = await EmployeeShift.query()
        .where('employeeId', employeeId)
        .whereNull('employeShiftsDeletedAt') // Excluir registros eliminados
        .whereBetween('employeShiftsApplySince', [hireDate, currentDate])
        .preload('shift')

      // Crear un mapa de fechas y turnos para facilitar la asociación
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Shift Exceptions')

      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0.38, row: 0.99 },
        ext: { width: 139, height: 50 },
      })
      worksheet.getRow(1).height = 60
      worksheet.mergeCells('A1:G1')

      const titleRow = worksheet.addRow(['Employee Shift Exceptions'])
      titleRow.font = { bold: true, size: 24, color: { argb: 'FFFFFFFF' } }
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:G2')
      worksheet.getCell('A' + 2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '244062' },
      }

      const periodRow = worksheet.addRow([
        `From: ${hireDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} , ${currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      ])
      periodRow.font = { italic: true, size: 12, color: { argb: 'FFFFFFFF' } }
      worksheet.mergeCells('A3:G3')
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.getCell('A3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '365F8B' },
      }
      const headerRow = worksheet.addRow([
        'Employee ID',
        'Employee Name',
        'Department',
        'Position',
        'Date',
        'Shift Assigned',
        'Exception Notes',
      ])
      headerRow.font = { bold: true, color: { argb: 'FFFFFF' } }
      worksheet.columns = [
        { key: 'employeeCode', width: 20 },
        { key: 'employeeName', width: 30 },
        { key: 'department', width: 30 },
        { key: 'position', width: 30 },
        { key: 'date', width: 20 },
        { key: 'shiftAssigned', width: 35 },
        { key: 'exceptionNotes', width: 30 },
      ]
      worksheet.columns.forEach((col) => {
        col.alignment = { horizontal: 'center', vertical: 'middle' }
      })
      headerRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: colNumber <= 5 ? '538DD5' : '16365C' },
        }
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
      })

      shiftExceptions.forEach((exception) => {
        const shiftsForDate = employeeShifts
          .filter(
            (employeeShift) =>
              new Date(employeeShift.employeShiftsApplySince).toDateString() !==
              new Date(exception.shiftExceptionsDate).toDateString()
          )
          .map((employeeShift) => employeeShift.shift?.shiftName) // Obtén los nombres de los turnos

        const shiftNames = shiftsForDate.length > 0 ? shiftsForDate.join(', ') : 'N/A'

        const row = worksheet.addRow({
          employeeCode: employee.employeeCode,
          employeeName: `${employee.employeeFirstName} ${employee.employeeLastName}`,
          department: employee.department?.departmentName || 'N/A',
          position: employee.position?.positionName || 'N/A',
          date: exception.shiftExceptionsDate,
          shiftAssigned: shiftNames,
          exceptionNotes: exception.shiftExceptionsDescription || 'N/A',
        })
        const exceptionNotesCell = row.getCell('exceptionNotes')
        const exceptionTypeName = exception.exceptionType?.exceptionTypeTypeName || 'N/A'
        const description = exception.shiftExceptionsDescription || 'N/A'
        exceptionNotesCell.value = {
          richText: [
            { text: exceptionTypeName + ': ', font: { bold: true } },
            { text: description },
          ],
        }
      })

      const buffer = await workbook.xlsx.writeBuffer()

      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      response.header(
        'Content-Disposition',
        `attachment; filename="shift_exceptions_employee.xlsx"`
      )
      response.status(201).send(buffer)
    } catch (error) {
      response.status(500).send({
        message: 'Error generating Excel file',
        error: error.message,
      })
    }
  }

  private async verify(employee: BiometricEmployeeInterface, employeeService: EmployeeService) {
    const existEmployee = await Employee.query()
      .where('employee_code', employee.empCode)
      .withTrashed()
      .first()
    if (!existEmployee) {
      await employeeService.syncCreate(employee)
    }
  }

  // Método para agregar fila de encabezado
  addHeadRow(worksheet: ExcelJS.Worksheet, employees: any[]) {
    const headerRow = worksheet.addRow([
      'Employee Code',
      'Employee Name',
      'Department',
      'Position',
      'Hire Date',
      'Work Modality',
      'Phone',
      'Gender',
      'CURP',
      'RFC',
      'Employee NSS',
    ])

    let fgColor = 'FFFFFFF'
    let color = '538DD5'
    for (let col = 1; col <= 5; col++) {
      const cell = worksheet.getCell(4, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }

    color = '16365C'
    for (let col = 6; col <= 8; col++) {
      const cell = worksheet.getCell(4, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }

    color = '538DD5'
    for (let col = 9; col <= 11; col++) {
      const cell = worksheet.getCell(4, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }

    headerRow.height = 30
    headerRow.font = { bold: true, color: { argb: fgColor } }

    this.adjustColumnWidths(worksheet)
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }, // Fija la primera fila
      { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
      { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
      { state: 'frozen', ySplit: 4 }, // Fija la cuarta fila
    ]
    employees.forEach((employee) => {
      worksheet.addRow([
        employee.employeeCode,
        `${employee.employeeFirstName} ${employee.employeeLastName}`,
        employee.department?.departmentName || '',
        employee.position?.positionName || '',
        employee.employeeHireDate ? employee.employeeHireDate.toISODate() : '',
        employee.employeeWorkSchedule || '',
        employee.person?.personPhone || '',
        employee.person?.personGender || '',
        employee.person?.personCurp || '',
        employee.person?.personRfc || '',
        employee.person?.personImssNss || '',
      ])
    })
  }

  adjustColumnWidths(worksheet: ExcelJS.Worksheet) {
    const widths = [20, 44, 44, 44, 25, 25, 25, 25, 25, 25, 25, 25, 30, 30, 30]
    widths.forEach((width, index) => {
      const column = worksheet.getColumn(index + 1)
      column.width = width
      column.alignment = { vertical: 'middle', horizontal: 'center' }
    })
  }

  addRowExcelEmpty(worksheet: ExcelJS.Worksheet) {
    worksheet.addRow([])
  }
}
