import { HttpContext } from '@adonisjs/core/http'
import UserResponsibleEmployee from '#models/user_responsible_employee'
import UserResponsibleEmployeeService from '#services/user_responsible_employee_service'
import { createdUserResponsibleEmployeeValidator } from '#validators/user_responsible_employee'

export default class UserResponsibleEmployeeController {
  /**
   * @swagger
   * /api/user-responsible-employees:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - User Responsible Employees
   *     summary: create new user responsible employee
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: number
   *                 description: User id
   *                 required: true
   *                 default: ''
   *               employeeId:
   *                 type: number
   *                 description: Employee Id
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
      const userId = request.input('userId')
      const employeeId = request.input('employeeId')
      const userResponsibleEmployee = {
        userId: userId,
        employeeId: employeeId,
      } as UserResponsibleEmployee
      const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
      const data = await request.validateUsing(createdUserResponsibleEmployeeValidator)
      const exist = await userResponsibleEmployeeService.verifyInfoExist(userResponsibleEmployee)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await userResponsibleEmployeeService.verifyInfo(userResponsibleEmployee)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }

      const newUserResponsibleEmployee = await userResponsibleEmployeeService.create(userResponsibleEmployee)
     
      response.status(201)
      return {
        type: 'success',
        title: 'User Responsible Employees',
        message: 'The user responsible employee was created successfully',
        data: {
          userResponsibleEmployee: newUserResponsibleEmployee,
        },
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
   * /api/user-responsible-employees/{userResponsibleEmployeeId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - User Responsible Employees
   *     summary: get user responsible employee by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: userResponsibleEmployeeId
   *         schema:
   *           type: number
   *         description: User responsible employee Id
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
      const userResponsibleEmployeeId = request.param('userResponsibleEmployeeId')
      if (!userResponsibleEmployeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The user responsible employee Id was not found',
          data: { userResponsibleEmployeeId },
        }
      }
      const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
      const showUserResponsibleEmployee =
        await userResponsibleEmployeeService.show(userResponsibleEmployeeId)
      if (!showUserResponsibleEmployee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The user responsible employee was not found',
          message: 'The user responsible employee was not found with the entered ID',
          data: { userResponsibleEmployeeId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'User Responsible Employees',
          message: 'The user responsible employee was found successfully',
          data: { userResponsibleEmployee: showUserResponsibleEmployee },
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
   * /api/user-responsible-employees/{userResponsibleEmployeeId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - User Responsible Employees
   *     summary: delete user responsible employee by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: userResponsibleEmployeeId
   *         schema:
   *           type: number
   *         description: User responsible employee id
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
  async delete({ request, response }: HttpContext) {
    try {
      const userResponsibleEmployeeId = request.param('userResponsibleEmployeeId')
      if (!userResponsibleEmployeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The user responsible employee Id was not found',
          data: { userResponsibleEmployeeId },
        }
      }
      const currentUserResponsibleEmployee = await UserResponsibleEmployee.query()
        .whereNull('user_responsible_employee_deleted_at')
        .where('user_responsible_employee_id', userResponsibleEmployeeId)
        .first()
      if (!currentUserResponsibleEmployee) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The user responsible employee was not found',
          message: 'The user responsible employee was not found with the entered ID',
          data: { userResponsibleEmployeeId },
        }
      }
      const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
      const deleteUserResponsibleEmployee = await userResponsibleEmployeeService.delete(
        currentUserResponsibleEmployee
      )
   
      response.status(200)
      return {
        type: 'success',
        title: 'User responsible employees',
        message: 'The user responsible employee was deleted successfully',
        data: { userResponsibleEmployee: deleteUserResponsibleEmployee },
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
