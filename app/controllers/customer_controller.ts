import { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'
import CustomerService from '#services/customer_service'
import { createCustomerValidator } from '#validators/customer'
import { CustomerFilterSearchInterface } from '../interfaces/customer_filter_search_interface.js'
import { cuid } from '@adonisjs/core/helpers'
export default class CustomerController {
  /**
   * @swagger
   * /api/customers:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers
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
  async index({ request, response }: HttpContext) {
    try {
      const search = request.input('search')
      const page = request.input('page', 1)
      const limit = request.input('limit', 100)
      const filters = {
        search: search,
        page: page,
        limit: limit,
      } as CustomerFilterSearchInterface
      const customerService = new CustomerService()
      const customers = await customerService.index(filters)
      response.status(200)
      return {
        type: 'success',
        title: 'Customers',
        message: 'The customers were found successfully',
        data: {
          customers,
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
   * /api/customers:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers
   *     summary: create new customer
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *        application/json:
   *           schema:
   *             type: object
   *             properties:
   *               customerUuid:
   *                 type: string
   *                 description: Customer uuid
   *                 required: false
   *                 default: ''
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
      const personId = request.input('personId')
      let customerUuid = request.input('customerUuid', null)
      customerUuid = customerUuid ? customerUuid : cuid()
      const customer = {
        personId: personId,
        customerUuid: customerUuid,
      } as Customer
      const customerService = new CustomerService()
      const data = await request.validateUsing(createCustomerValidator)
      const valid = await customerService.verifyInfo(customer)
      if (valid.status !== 200) {
        response.status(valid.status)
        return {
          type: valid.type,
          title: valid.title,
          message: valid.message,
          data: { ...data },
        }
      }
      const exist = await customerService.verifyInfoExist(customer)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const newCustomer = await customerService.create(customer)
      response.status(201)
      return {
        type: 'success',
        title: 'Customers',
        message: 'The customer was created successfully',
        data: { customer: newCustomer },
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
   * /api/customers/{customerId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers
   *     summary: update customer
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: customerId
   *         schema:
   *           type: number
   *         description: Customer id
   *         required: true
   *     requestBody:
   *       content:
   *        application/json:
   *           schema:
   *             type: object
   *             properties:
   *               customerUuid:
   *                 type: string
   *                 description: Customer uuid
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
  async update({ request, response }: HttpContext) {
    try {
      const customerId = request.param('customerId')
      let customerUuid = request.input('customerUuid', null)
      customerUuid = customerUuid ? customerUuid : cuid()
      const customer = {
        customerId: customerId,
        customerUuid: customerUuid,
      } as Customer
      if (!customerId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The customer Id was not found',
          message: 'Missing data to process',
          data: { ...customer },
        }
      }
      const currentCustomer = await Customer.query()
        .whereNull('customer_deleted_at')
        .where('customer_id', customerId)
        .first()
      if (!currentCustomer) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The customer was not found',
          message: 'The customer was not found with the entered ID',
          data: { ...request.all() },
        }
      }
      const customerService = new CustomerService()
      const valid = await customerService.verifyInfo(customer)
      if (valid.status !== 200) {
        response.status(valid.status)
        return {
          type: valid.type,
          title: valid.title,
          message: valid.message,
          data: { ...customer },
        }
      }
      const updateCustomer = await customerService.update(currentCustomer, customer)
      response.status(200)
      return {
        type: 'success',
        title: 'Customers',
        message: 'The customer was updated successfully',
        data: { customer: updateCustomer },
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
   * /api/customers/{customerId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers
   *     summary: delete customer
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: customerId
   *         schema:
   *           type: number
   *         description: Customer id
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
      const customerId = request.param('customerId')
      if (!customerId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The customer Id was not found',
          message: 'Missing data to process',
          data: { customerId },
        }
      }
      const currentCustomer = await Customer.query()
        .whereNull('customer_deleted_at')
        .where('customer_id', customerId)
        .first()
      if (!currentCustomer) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The customer was not found',
          message: 'The customer was not found with the entered ID',
          data: { customerId },
        }
      }
      const customerService = new CustomerService()
      const deleteCustomer = await customerService.delete(currentCustomer)
      if (deleteCustomer) {
        response.status(200)
        return {
          type: 'success',
          title: 'Customers',
          message: 'The customer was deleted successfully',
          data: { customer: deleteCustomer },
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
   * /api/customers/{customerId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers
   *     summary: get customer by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: customerId
   *         schema:
   *           type: number
   *         description: Customer id
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
      const customerId = request.param('customerId')
      if (!customerId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The customer Id was not found',
          message: 'Missing data to process',
          data: { customerId },
        }
      }
      const customerService = new CustomerService()
      const showCustomer = await customerService.show(customerId)
      if (!showCustomer) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The customer was not found',
          message: 'The customer was not found with the entered ID',
          data: { customerId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Customers',
          message: 'The customer was found successfully',
          data: { customer: showCustomer },
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
   * /api/customers/{customerId}/proceeding-files:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Customers
   *     summary: get proceeding files by customer id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: customerId
   *         schema:
   *           type: number
   *         description: Customer id
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
      const customerId = request.param('customerId')
      if (!customerId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The customer Id was not found',
          message: 'Missing data to process',
          data: { customerId },
        }
      }
      const customerService = new CustomerService()
      const showCustomer = await customerService.show(customerId)
      if (!showCustomer) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The customer was not found',
          message: 'The customer was not found with the entered ID',
          data: { customerId },
        }
      }
      const proceedingFiles = await customerService.getProceedingFiles(customerId)
      response.status(200)
      return {
        type: 'success',
        title: 'Customers',
        message: 'The proceeding files were found successfully',
        data: { proceedingFiles: proceedingFiles },
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
