import { HttpContext } from '@adonisjs/core/http'
import {
  createEmployeeAddressValidator,
  updateEmployeeAddressValidator,
} from '#validators/employee_address'
import EmployeeAddressService from '#services/employee_address_service'
import EmployeeAddress from '#models/employee_address'

export default class EmployeeAddressController {
  /**
   * @swagger
   * /api/employees-address/:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees Address
   *     summary: get all relation employee-address
   *     produces:
   *       - application/json
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
  async index({ response }: HttpContext) {
    try {
      const employeeAddressService = new EmployeeAddressService()
      const showEmployeeAddress = await employeeAddressService.index()
      response.status(200)
      return {
        type: 'success',
        title: 'Employees address',
        message: 'The relation employee-address were found successfully',
        data: { employeeAddress: showEmployeeAddress },
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
   * /api/employees-address:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees Address
   *     summary: create new relation employee-address
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               employeeId:
   *                 type: number
   *                 description: Employee id
   *                 required: true
   *                 default: ''
   *               addressId:
   *                 type: number
   *                 description: Address id
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
      const employeeId = request.input('employeeId')
      const addressId = request.input('addressId')
      const employeeAddress = {
        employeeId: employeeId,
        addressId: addressId,
      } as EmployeeAddress
      const employeeAddressService = new EmployeeAddressService()
      const data = await request.validateUsing(createEmployeeAddressValidator)
      const exist = await employeeAddressService.verifyInfoExist(employeeAddress)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const newEmployeeAddress = await employeeAddressService.create(employeeAddress)
      if (newEmployeeAddress) {
        response.status(201)
        return {
          type: 'success',
          title: 'Employees proceeding files',
          message: 'The relation employee-address was created successfully',
          data: { employeeAddress: newEmployeeAddress },
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
   * /api/employees-proceeding-files/{employeeAddressId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees Proceeding Files
   *     summary: update relation employee-address
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeAddressId
   *         schema:
   *           type: number
   *         description: Employee proceeding file id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               employeeId:
   *                 type: number
   *                 description: Employee id
   *                 required: true
   *                 default: ''
   *               addressId:
   *                 type: number
   *                 description: Address id
   *                 required: true
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
  async update({ request, response }: HttpContext) {
    try {
      const employeeAddressId = request.param('employeeAddressId')
      const employeeId = request.input('employeeId')
      const addressId = request.input('addressId')
      const employeeAddress = {
        employeeAddressId: employeeAddressId,
        employeeId: employeeId,
        addressId: addressId,
      } as EmployeeAddress
      if (!employeeAddressId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation employee-address Id was not found',
          message: 'Missing data to process',
          data: { ...employeeAddress },
        }
      }
      const currentEmployeeAddress = await EmployeeAddress.query()
        .whereNull('employee_proceeding_file_deleted_at')
        .where('employee_proceeding_file_id', employeeAddressId)
        .first()
      if (!currentEmployeeAddress) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation employee-address was not found',
          message: 'The relation employee-address was not found with the entered ID',
          data: { ...employeeAddress },
        }
      }
      const employeeAddressService = new EmployeeAddressService()
      const data = await request.validateUsing(updateEmployeeAddressValidator)
      const exist = await employeeAddressService.verifyInfoExist(employeeAddress)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const updateEmployeeAddress = await employeeAddressService.update(
        currentEmployeeAddress,
        employeeAddress
      )
      if (updateEmployeeAddress) {
        response.status(200)
        return {
          type: 'success',
          title: 'Employee proceeding files',
          message: 'The relation employee-address was updated successfully',
          data: { employeeAddress: updateEmployeeAddress },
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
   * /api/employees-address/{employeeAddressId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees Proceeding Files
   *     summary: delete relation employee proceeding files
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeAddressId
   *         schema:
   *           type: number
   *         description: Employee proceeding file id
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
      const employeeAddressId = request.param('employeeAddressId')
      if (!employeeAddressId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation employee-address Id was not found',
          message: 'Missing data to process',
          data: { employeeAddressId },
        }
      }
      const currentEmployeeAddress = await EmployeeAddress.query()
        .whereNull('employee_proceeding_file_deleted_at')
        .where('employee_proceeding_file_id', employeeAddressId)
        .first()
      if (!currentEmployeeAddress) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation employee-address was not found',
          message: 'The relation employee-address was not found with the entered ID',
          data: { employeeAddressId },
        }
      }
      const employeeAddressService = new EmployeeAddressService()
      const deleteEmployeeAddress = await employeeAddressService.delete(currentEmployeeAddress)
      if (deleteEmployeeAddress) {
        response.status(200)
        return {
          type: 'success',
          title: 'Employees proceeding files',
          message: 'The relation employee-address was deleted successfully',
          data: { employeeAddress: deleteEmployeeAddress },
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
   * /api/employees-address/{employeeAddressId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employees Proceeding Files
   *     summary: get relation employee-address by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeAddressId
   *         schema:
   *           type: number
   *         description: Employee proceeding file id
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
      const employeeAddressId = request.param('employeeAddressId')
      if (!employeeAddressId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The relation employee-address Id was not found',
          data: { employeeAddressId },
        }
      }
      const employeeAddressService = new EmployeeAddressService()
      const showEmployeeAddress = await employeeAddressService.show(employeeAddressId)
      if (!showEmployeeAddress) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation employee-address was not found',
          message: 'The relation employee-address was not found with the entered ID',
          data: { employeeAddressId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Employees proceeding files',
          message: 'The relation employee-address was found successfully',
          data: { employeeAddress: showEmployeeAddress },
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
