import CustomerProceedingFile from '#models/customer_proceeding_file'
import CustomerProceedingFileService from '#services/customer_proceeding_file_service'
import {
  createCustomerProceedingFileValidator,
  updateCustomerProceedingFileValidator,
} from '#validators/customer_proceeding_file'
import { HttpContext } from '@adonisjs/core/http'
import { CustomerProceedingFileFilterInterface } from '../interfaces/customer_proceeding_file_filter_interface.js'

export default class CustomerProceedingFileController {
  /**
   * @swagger
   * /api/customers-proceeding-files/:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers Proceeding Files
   *     summary: get all relation customer-proceedingfile
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
  async index({ response, i18n }: HttpContext) {
    const t = i18n.formatMessage.bind(i18n)
    try {
      const customerProceedingFileService = new CustomerProceedingFileService()
      const showCustomerProceedingFiles = await customerProceedingFileService.index()
      response.status(200)
      return {
        type: 'success',
        title: t('resources'),
        message: t('resources_were_found_successfully'),
        data: { customerProceedingFiles: showCustomerProceedingFiles },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: t('server_error'),
        message: t('an_unexpected_error_has_occurred_on_the_server'),
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/customers-proceeding-files:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers Proceeding Files
   *     summary: create new relation customer-proceeding-files
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               customerId:
   *                 type: number
   *                 description: Customer id
   *                 required: true
   *                 default: ''
   *               proceedingFileId:
   *                 type: number
   *                 description: Proceeding file id
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
  async store({ request, response, i18n }: HttpContext) {
    const t = i18n.formatMessage.bind(i18n)

    try {
      const customerId = request.input('customerId')
      const proceedingFileId = request.input('proceedingFileId')
      const customerProceedingFile = {
        customerId: customerId,
        proceedingFileId: proceedingFileId,
      } as CustomerProceedingFile
      const customerProceedingFileService = new CustomerProceedingFileService()
      const data = await request.validateUsing(createCustomerProceedingFileValidator)
      const exist = await customerProceedingFileService.verifyInfoExist(customerProceedingFile)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await customerProceedingFileService.verifyInfo(customerProceedingFile)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const newCustomerProceedingFile =
        await customerProceedingFileService.create(customerProceedingFile)
      if (newCustomerProceedingFile) {
        response.status(201)
        return {
          type: 'success',
          title: 'Customers proceeding files',
          message: 'The relation customer-proceedingfile was created successfully',
          data: { customerProceedingFile: newCustomerProceedingFile },
        }
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: t('server_error'),
        message: t('an_unexpected_error_has_occurred_on_the_server'),
        error: messageError,
      }
    }
  }
  /**
   * @swagger
   * /api/customers-proceeding-files/{customerProceedingFileId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers Proceeding Files
   *     summary: update relation customer-proceedingfile
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: customerProceedingFileId
   *         schema:
   *           type: number
   *         description: Customer proceeding file id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               customerId:
   *                 type: number
   *                 description: Customer id
   *                 required: true
   *                 default: ''
   *               proceedingFileId:
   *                 type: number
   *                 description: ProceedingFile id
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
  async update({ request, response, i18n }: HttpContext) {
    const t = i18n.formatMessage.bind(i18n)
    try {
      const customerProceedingFileId = request.param('customerProceedingFileId')
      const customerId = request.input('customerId')
      const proceedingFileId = request.input('proceedingFileId')
      const customerProceedingFile = {
        customerProceedingFileId: customerProceedingFileId,
        customerId: customerId,
        proceedingFileId: proceedingFileId,
      } as CustomerProceedingFile
      if (!customerProceedingFileId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation customer-proceedingfile Id was not found',
          message: 'Missing data to process',
          data: { ...customerProceedingFile },
        }
      }
      const currentCustomerProceedingFile = await CustomerProceedingFile.query()
        .whereNull('customer_proceeding_file_deleted_at')
        .where('customer_proceeding_file_id', customerProceedingFileId)
        .first()
      if (!currentCustomerProceedingFile) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation customer-proceedingfile was not found',
          message: 'The relation customer-proceedingfile was not found with the entered ID',
          data: { ...customerProceedingFile },
        }
      }
      const customerProceedingFileService = new CustomerProceedingFileService()
      const data = await request.validateUsing(updateCustomerProceedingFileValidator)
      const exist = await customerProceedingFileService.verifyInfoExist(customerProceedingFile)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await customerProceedingFileService.verifyInfo(customerProceedingFile)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const updateCustomerProceedingFile = await customerProceedingFileService.update(
        currentCustomerProceedingFile,
        customerProceedingFile
      )
      if (updateCustomerProceedingFile) {
        response.status(200)
        return {
          type: 'success',
          title: 'Customer proceeding files',
          message: 'The relation customer-proceedingfile was updated successfully',
          data: { customerProceedingFile: updateCustomerProceedingFile },
        }
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: t('server_error'),
        message: t('an_unexpected_error_has_occurred_on_the_server'),
        error: messageError,
      }
    }
  }
  /**
   * @swagger
   * /api/customers-proceeding-files/{customerProceedingFileId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers Proceeding Files
   *     summary: delete relation customer proceeding files
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: customerProceedingFileId
   *         schema:
   *           type: number
   *         description: Customer proceeding file id
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
  async delete({ request, response, i18n }: HttpContext) {
    const t = i18n.formatMessage.bind(i18n)
    try {
      const customerProceedingFileId = request.param('customerProceedingFileId')
      if (!customerProceedingFileId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation customer-proceedingfile Id was not found',
          message: 'Missing data to process',
          data: { customerProceedingFileId },
        }
      }
      const currentCustomerProceedingFile = await CustomerProceedingFile.query()
        .whereNull('customer_proceeding_file_deleted_at')
        .where('customer_proceeding_file_id', customerProceedingFileId)
        .first()
      if (!currentCustomerProceedingFile) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation customer-proceedingfile was not found',
          message: 'The relation customer-proceedingfile was not found with the entered ID',
          data: { customerProceedingFileId },
        }
      }
      const customerProceedingFileService = new CustomerProceedingFileService()
      const deleteCustomerProceedingFile = await customerProceedingFileService.delete(
        currentCustomerProceedingFile
      )
      if (deleteCustomerProceedingFile) {
        response.status(200)
        return {
          type: 'success',
          title: 'Customers proceeding files',
          message: 'The relation customer-proceedingfile was deleted successfully',
          data: { customerProceedingFile: deleteCustomerProceedingFile },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: t('server_error'),
        message: t('an_unexpected_error_has_occurred_on_the_server'),
        error: error.message,
      }
    }
  }
  /**
   * @swagger
   * /api/customers-proceeding-files/{customerProceedingFileId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers Proceeding Files
   *     summary: get relation customer-proceedingfile by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: customerProceedingFileId
   *         schema:
   *           type: number
   *         description: Customer proceeding file id
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
  async show({ request, response, i18n }: HttpContext) {
    const t = i18n.formatMessage.bind(i18n)
    try {
      const customerProceedingFileId = request.param('customerProceedingFileId')
      if (!customerProceedingFileId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation customer-proceedingfile Id was not found',
          message: 'Missing data to process',
          data: { customerProceedingFileId },
        }
      }
      const customerProceedingFileService = new CustomerProceedingFileService()
      const showCustomerProceedingFile =
        await customerProceedingFileService.show(customerProceedingFileId)
      if (!showCustomerProceedingFile) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation customer-proceedingfile was not found',
          message: 'The relation customer-proceedingfile was not found with the entered ID',
          data: { customerProceedingFileId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Customers proceeding files',
          message: 'The relation customer-proceedingfile was found successfully',
          data: { customerProceedingFile: showCustomerProceedingFile },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: t('server_error'),
        message: t('an_unexpected_error_has_occurred_on_the_server'),
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/customers-proceeding-files/get-expired-and-expiring:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers Proceeding Files
   *     summary: get expired and expiring proceeding files by date
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: dateStart
   *         in: query
   *         required: false
   *         description: Date start (YYYY-MM-DD)
   *         format: date
   *         schema:
   *           type: string
   *       - name: dateEnd
   *         in: query
   *         required: false
   *         description: Date end (YYYY-MM-DD)
   *         format: date
   *         schema:
   *           type: string
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
  async getExpiresAndExpiring({ request, response, i18n }: HttpContext) {
    const t = i18n.formatMessage.bind(i18n)
    try {
      const dateStart = request.input('dateStart')
      const dateEnd = request.input('dateEnd')
      const filters = {
        dateStart: dateStart,
        dateEnd: dateEnd,
      } as CustomerProceedingFileFilterInterface
      const customerProceddingFileService = new CustomerProceedingFileService()
      const customerProceedingFiles =
        await customerProceddingFileService.getExpiredAndExpiring(filters)
      response.status(200)
      return {
        type: 'success',
        title: 'Customer proceeding files',
        message: 'The customer proceeding files were found successfully',
        data: {
          customerProceedingFiles: customerProceedingFiles,
        },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: t('server_error'),
        message: t('an_unexpected_error_has_occurred_on_the_server'),
        error: error.message,
      }
    }
  }
}
