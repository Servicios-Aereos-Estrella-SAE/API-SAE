import EmployeeBank from '#models/employee_bank'
import EmployeeBankService from '#services/employee_bank_service'
import { createEmployeeBankValidator, updateEmployeeBankValidator } from '#validators/employee_bank'
import { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class EmployeeBankController {
  /**
   * @swagger
   * /api/employee-banks:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employee Banks
   *     summary: create new employee bank
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               employeeBankAccountClabe:
   *                 type: string
   *                 description: Employee bank account clabe
   *                 required: true
   *                 default: ''
   *               employeeBankAccountNumber:
   *                 type: string
   *                 description: Employee bank account number
   *                 required: false
   *                 default: ''
   *               employeeBankAccountCardNumber:
   *                 type: string
   *                 description: Employee bank account card number
   *                 required: false
   *                 default: ''
   *               employeeBankAccountType:
   *                 type: string
   *                 format: date
   *                 description: Employee bank account type
   *                 required: false
   *                 default: ''
   *               employeeBankAccountCurrencyType:
   *                 type: string
   *                 format: date
   *                 description: Employee bank account currency type
   *                 required: true
   *                 default: ''
   *                 enum: [MXN, USD]
   *               employeeId:
   *                 type: number
   *                 description: Employee id
   *                 required: true
   *                 default: ''
   *               bankId:
   *                 type: number
   *                 description: Bank id
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
      await request.validateUsing(createEmployeeBankValidator)
      const employeeBankService = new EmployeeBankService()
      const employeeBankAccountClabe = request.input('employeeBankAccountClabe')
      const employeeBankAccountClabeLastNumbers = employeeBankAccountClabe.slice(-4)
      const employeeBankAccountNumber = request.input('employeeBankAccountNumber')
      const employeeBankAccountNumberLastNumbers = employeeBankAccountNumber
        ? employeeBankAccountNumber.slice(-4)
        : ''
      const employeeBankAccountCardNumber = request.input('employeeBankAccountCardNumber')
      const employeeBankAccountCardNumberLastNumbers = employeeBankAccountCardNumber
        ? employeeBankAccountCardNumber.slice(-4)
        : ''
      const employeeBankAccountType = request.input('employeeBankAccountType')
      const employeeBankAccountCurrencyType = request.input('employeeBankAccountCurrencyType')
      const employeeId = request.input('employeeId')
      const bankId = request.input('bankId')
      const secretKey = env.get('APP_ENCRYPT_KEY') as string
      const employeeBank = {
        employeeBankAccountClabe: employeeBankService.encrypt(employeeBankAccountClabe, secretKey),
        employeeBankAccountClabeLastNumbers: employeeBankAccountClabeLastNumbers,
        employeeBankAccountNumber: employeeBankService.encrypt(
          employeeBankAccountNumber,
          secretKey
        ),
        employeeBankAccountNumberLastNumbers: employeeBankAccountNumberLastNumbers,
        employeeBankAccountCardNumber: employeeBankService.encrypt(
          employeeBankAccountCardNumber,
          secretKey
        ),
        employeeBankAccountCardNumberLastNumbers: employeeBankAccountCardNumberLastNumbers,
        employeeBankAccountType: employeeBankAccountType,
        employeeBankAccountCurrencyType: employeeBankAccountCurrencyType,
        employeeId: employeeId,
        bankId: bankId,
      } as EmployeeBank

      const exist = await employeeBankService.verifyInfoExist(employeeBank)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...employeeBank },
        }
      }
      const newEmployeeBank = await employeeBankService.create(employeeBank)
      if (newEmployeeBank) {
        response.status(201)
        return {
          type: 'success',
          title: 'Employee Bank',
          message: 'The employee bank was created successfully',
          data: { employeeBank: newEmployeeBank },
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
   * /api/employee-banks/{employeeBankId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employee Banks
   *     summary: update empoyee bank
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeBankId
   *         schema:
   *           type: number
   *         description: Employee bank id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               employeeBankAccountClabe:
   *                 type: string
   *                 description: Employee bank account clabe
   *                 required: true
   *                 default: ''
   *               employeeBankAccountNumber:
   *                 type: string
   *                 description: Employee bank account number
   *                 required: false
   *                 default: ''
   *               employeeBankAccountCardNumber:
   *                 type: string
   *                 description: Employee bank account card number
   *                 required: false
   *                 default: ''
   *               employeeBankAccountType:
   *                 type: string
   *                 format: date
   *                 description: Employee bank account type
   *                 required: false
   *                 default: ''
   *               employeeBankAccountCurrencyType:
   *                 type: string
   *                 format: date
   *                 description: Employee bank account currency type
   *                 required: true
   *                 default: ''
   *                 enum: [MXN, USD]
   *               bankId:
   *                 type: number
   *                 description: Bank id
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
      const employeeBankService = new EmployeeBankService()
      const employeeBankId = request.param('employeeBankId')
      const employeeBankAccountClabe = request.input('employeeBankAccountClabe')
      const employeeBankAccountClabeLastNumbers = employeeBankAccountClabe.slice(-4)
      const employeeBankAccountNumber = request.input('employeeBankAccountNumber')
      const employeeBankAccountNumberLastNumbers = employeeBankAccountNumber
        ? employeeBankAccountNumber.slice(-4)
        : ''
      const employeeBankAccountCardNumber = request.input('employeeBankAccountCardNumber')
      const employeeBankAccountCardNumberLastNumbers = employeeBankAccountCardNumber
        ? employeeBankAccountCardNumber.slice(-4)
        : ''
      const employeeBankAccountType = request.input('employeeBankAccountType')
      const employeeBankAccountCurrencyType = request.input('employeeBankAccountCurrencyType')
      const bankId = request.input('bankId')
      const secretKey = env.get('APP_ENCRYPT_KEY') as string
      const employeeBank = {
        employeeBankId: employeeBankId,
        employeeBankAccountClabe: employeeBankService.encrypt(employeeBankAccountClabe, secretKey),
        employeeBankAccountClabeLastNumbers: employeeBankAccountClabeLastNumbers,
        employeeBankAccountNumber: employeeBankService.encrypt(
          employeeBankAccountNumber,
          secretKey
        ),
        employeeBankAccountNumberLastNumbers: employeeBankAccountNumberLastNumbers,
        employeeBankAccountCardNumber: employeeBankService.encrypt(
          employeeBankAccountCardNumber,
          secretKey
        ),
        employeeBankAccountCardNumberLastNumbers: employeeBankAccountCardNumberLastNumbers,
        employeeBankAccountType: employeeBankAccountType,
        employeeBankAccountCurrencyType: employeeBankAccountCurrencyType,
        bankId: bankId,
      } as EmployeeBank
      if (!employeeBankId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The employee bank Id was not found',
          data: { ...employeeBank },
        }
      }
      const currentEmployeeBank = await EmployeeBank.query()
        .whereNull('employee_bank_deleted_at')
        .where('employee_bank_id', employeeBankId)
        .first()
      if (!currentEmployeeBank) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee bank was not found',
          message: 'The employee bank was not found with the entered ID',
          data: { ...employeeBank },
        }
      }

      await request.validateUsing(updateEmployeeBankValidator)
      const updateEmployeeBank = await employeeBankService.update(currentEmployeeBank, employeeBank)
      if (updateEmployeeBank) {
        response.status(200)
        return {
          type: 'success',
          title: 'Employee banks',
          message: 'The employee bank was updated successfully',
          data: { employeeBank: updateEmployeeBank },
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
   * /api/employee-banks/{employeeBankId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employee Banks
   *     summary: delete employee bank
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeBankId
   *         schema:
   *           type: number
   *         description: Employee bank id
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
      const employeeBankId = request.param('employeeBankId')
      if (!employeeBankId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The employee bank Id was not found',
          data: { employeeBankId },
        }
      }
      const currentEmployeeBank = await EmployeeBank.query()
        .whereNull('employee_bank_deleted_at')
        .where('employee_bank_id', employeeBankId)
        .first()
      if (!currentEmployeeBank) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee bank was not found',
          message: 'The employee bank was not found with the entered ID',
          data: { employeeBankId },
        }
      }
      const employeeBankService = new EmployeeBankService()
      const deleteEmployeeBank = await employeeBankService.delete(currentEmployeeBank)
      if (deleteEmployeeBank) {
        response.status(200)
        return {
          type: 'success',
          title: 'Employee bank',
          message: 'The employee bank was deleted successfully',
          data: { employeeBank: deleteEmployeeBank },
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
   * /api/employee-banks/{employeeBankId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Employee Banks
   *     summary: get employee bank by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeBankId
   *         schema:
   *           type: number
   *         description: Employee bank id
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
      const employeeBankId = request.param('employeeBankId')
      if (!employeeBankId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The employee bank Id was not found',
          data: { employeeBankId },
        }
      }
      const employeeBankService = new EmployeeBankService()
      const showEmployeeBank = await employeeBankService.show(employeeBankId)
      if (!showEmployeeBank) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The employee bank was not found',
          message: 'The employee bank was not found with the entered ID',
          data: { employeeBankId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Employee bank',
          message: 'The employee bank was found successfully',
          data: { employeeBank: showEmployeeBank },
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
