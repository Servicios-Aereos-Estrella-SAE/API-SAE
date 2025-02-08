import EmployeeChildren from '#models/employee_children'
import EmployeeChildrenService from '#services/employee_children_service'
import {
  createEmployeeChildrenValidator,
  updateEmployeeChildrenValidator,
} from '#validators/employee_children'
import { HttpContext } from '@adonisjs/core/http'

export default class EmployeeChildrenController {
  /**
   * @swagger
   * /api/employee-children:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employee Children
   *     summary: create new employee children
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               employeeChildrenFirstname:
   *                 type: string
   *                 description: Employee children first name
   *                 required: true
   *                 default: ''
   *               employeeChildrenLastname:
   *                 type: string
   *                 description: Employee children last name
   *                 required: true
   *                 default: ''
   *               employeeChildrenSecondLastname:
   *                 type: string
   *                 description: Employee children second last name
   *                 required: true
   *                 default: ''
   *               employeeChildrenGender:
   *                 type: string
   *                 description: Employee children gender
   *                 required: false
   *                 default: ''
   *               employeeChildrenBirthday:
   *                 type: string
   *                 format: date
   *                 description: Employee children birthday (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               employeeId:
   *                 type: number
   *                 description: Employee id
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
      const employeeChildrenFirstname = request.input('employeeChildrenFirstname')
      const employeeChildrenLastname = request.input('employeeChildrenLastname')
      const employeeChildrenSecondLastname = request.input('employeeChildrenSecondLastname')
      const employeeChildrenGender = request.input('employeeChildrenGender')
      const employeeId = request.input('employeeId')
      let employeeChildrenBirthday = request.input('employeeChildrenBirthday')
      employeeChildrenBirthday = employeeChildrenBirthday
        ? (employeeChildrenBirthday.split('T')[0] + ' 00:000:00').replace('"', '')
        : null
      const employeeChildren = {
        employeeChildrenFirstname: employeeChildrenFirstname,
        employeeChildrenLastname: employeeChildrenLastname,
        employeeChildrenSecondLastname: employeeChildrenSecondLastname,
        employeeChildrenGender: employeeChildrenGender,
        employeeChildrenBirthday: employeeChildrenBirthday,
        employeeId: employeeId,
      } as EmployeeChildren
      const employeeChildrenService = new EmployeeChildrenService()
      const exist = await employeeChildrenService.verifyInfoExist(employeeChildren)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...employeeChildren },
        }
      }
      await request.validateUsing(createEmployeeChildrenValidator)
      const newEmployeeChildren = await employeeChildrenService.create(employeeChildren)
      if (newEmployeeChildren) {
        response.status(201)
        return {
          type: 'success',
          title: 'Employee Children',
          message: 'The employee children was created successfully',
          data: { employeeChildren: newEmployeeChildren },
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
   * /api/employee-children/{employeeChildrenId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employee Children
   *     summary: update empoyee children
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeChildrenId
   *         schema:
   *           type: number
   *         description: Employee children id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               employeeChildrenFirstname:
   *                 type: string
   *                 description: Employee children first name
   *                 required: true
   *                 default: ''
   *               employeeChildrenLastname:
   *                 type: string
   *                 description: Employee children last name
   *                 required: true
   *                 default: ''
   *               employeeChildrenSecondLastname:
   *                 type: string
   *                 description: Employee children second last name
   *                 required: true
   *                 default: ''
   *               employeeChildrenGender:
   *                 type: string
   *                 description: Employee children gender
   *                 required: false
   *                 default: ''
   *               employeeChildrenBirthday:
   *                 type: string
   *                 format: date
   *                 description: Employee children birthday (YYYY-MM-DD)
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
  async update({ request, response }: HttpContext) {
    try {
      const employeeChildrenId = request.param('employeeChildrenId')
      const employeeChildrenFirstname = request.input('employeeChildrenFirstname')
      const employeeChildrenLastname = request.input('employeeChildrenLastname')
      const employeeChildrenSecondLastname = request.input('employeeChildrenSecondLastname')
      const employeeChildrenGender = request.input('employeeChildrenGender')
      let employeeChildrenBirthday = request.input('employeeChildrenBirthday')
      employeeChildrenBirthday = employeeChildrenBirthday
        ? (employeeChildrenBirthday.split('T')[0] + ' 00:000:00').replace('"', '')
        : null
      const employeeChildren = {
        employeeChildrenId: employeeChildrenId,
        employeeChildrenFirstname: employeeChildrenFirstname,
        employeeChildrenLastname: employeeChildrenLastname,
        employeeChildrenSecondLastname: employeeChildrenSecondLastname,
        employeeChildrenGender: employeeChildrenGender,
        employeeChildrenBirthday: employeeChildrenBirthday,
      } as EmployeeChildren
      if (!employeeChildrenId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The employee children Id was not found',
          data: { ...employeeChildren },
        }
      }
      const currentEmployeeChildren = await EmployeeChildren.query()
        .whereNull('employee_children_deleted_at')
        .where('employee_children_id', employeeChildrenId)
        .first()
      if (!currentEmployeeChildren) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee children was not found',
          message: 'The employee children was not found with the entered ID',
          data: { ...employeeChildren },
        }
      }
      const employeeChildrenService = new EmployeeChildrenService()
      await request.validateUsing(updateEmployeeChildrenValidator)
      const updateEmployeeChildren = await employeeChildrenService.update(
        currentEmployeeChildren,
        employeeChildren
      )
      if (updateEmployeeChildren) {
        response.status(201)
        return {
          type: 'success',
          title: 'Employee childrens',
          message: 'The employee children was updated successfully',
          data: { employeeChildren: updateEmployeeChildren },
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
   * /api/employee-children/{employeeChildrenId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employee Children
   *     summary: delete employee children
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeChildrenId
   *         schema:
   *           type: number
   *         description: Employee children id
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
      const employeeChildrenId = request.param('employeeChildrenId')
      if (!employeeChildrenId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee children Id was not found',
          message: 'Missing data to process',
          data: { employeeChildrenId },
        }
      }
      const currentEmployeeChildren = await EmployeeChildren.query()
        .whereNull('emoloyee_children_deleted_at')
        .where('employee_children_id', employeeChildrenId)
        .first()
      if (!currentEmployeeChildren) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee children was not found',
          message: 'The employee children was not found with the entered ID',
          data: { employeeChildrenId },
        }
      }
      const employeeChildrenService = new EmployeeChildrenService()
      const deleteEmployeeChildren = await employeeChildrenService.delete(currentEmployeeChildren)
      if (deleteEmployeeChildren) {
        response.status(201)
        return {
          type: 'success',
          title: 'Employee children',
          message: 'The employee children was deleted successfully',
          data: { employeeChildren: deleteEmployeeChildren },
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
   * /api/employee-children/{employeeChildrenId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employee Children
   *     summary: get employee children by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeChildrenId
   *         schema:
   *           type: number
   *         description: Employee children id
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
      const employeeChildrenId = request.param('employeeChildrenId')
      if (!employeeChildrenId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The employee children Id was not found',
          data: { employeeChildrenId },
        }
      }
      const employeeChildrenService = new EmployeeChildrenService()
      const showEmployeeChildren = await employeeChildrenService.show(employeeChildrenId)
      if (!showEmployeeChildren) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee children was not found',
          message: 'The employee children was not found with the entered ID',
          data: { employeeChildrenId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Employee children',
          message: 'The employee children was found successfully',
          data: { employeeChildren: showEmployeeChildren },
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
