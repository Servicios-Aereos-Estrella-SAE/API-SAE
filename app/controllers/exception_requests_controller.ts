// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from '@adonisjs/core/http'
import ExceptionRequest from '../models/exception_request.js'
import { formatResponse } from '../helpers/responseFormatter.js'
import {
  storeExceptionRequestValidator,
  updateExceptionRequestValidator,
} from '#validators/exception_request'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

export default class ExceptionRequestsController {
  /**
   * @swagger
   * tags:
   *   name: ExceptionRequests
   *   description: API for managing exception requests
   */
  /**
   * @swagger
   * /api/exception-requests/{id}/status:
   *   patch:
   *     summary: Update the status of a specific exception request
   *     tags: [ExceptionRequests]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the exception request
   *         schema:
   *           type: integer
   *       - name: status
   *         in: body
   *         required: true
   *         description: The new status of the exception request
   *         schema:
   *           type: object
   *           required:
   *             - status
   *           properties:
   *             status:
   *               type: string
   *               enum: [accepted, refused]
   *               example: accepted
   *     responses:
   *       200:
   *         description: Status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Status updated successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *       400:
   *         description: Invalid status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Invalid status. Only "accepted" or "refused" are allowed.
   *       404:
   *         description: ExceptionRequest not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: ExceptionRequest not found
   */
  async updateStatus({ request, params, response }: HttpContext) {
    const { status } = request.only(['status'])

    if (status !== 'accepted' && status !== 'refused') {
      return response.status(400).json({
        error: 'Invalid status. Only "accepted" or "refused" are allowed.',
      })
    }
    const exceptionRequest = await ExceptionRequest.find(params.id)
    if (!exceptionRequest) {
      return response.status(404).json({
        error: 'ExceptionRequest not found',
      })
    }
    exceptionRequest.exceptionRequestStatus = status
    await exceptionRequest.save()
    const userEmail = env.get('SMTP_USERNAME')
    if (userEmail) {
      await mail.send((message) => {
        message
          .to('wramirez@siler-mx.com')
          .from(userEmail, 'SAE')
          .subject('Notification: Status of Exception Request Updated')
          .htmlView('emails/update_status_mail', {
            newStatus: status,
          })
      })
    }
    return response.status(200).json({
      message: 'Status updated successfully',
      data: exceptionRequest,
    })
  }
  /**
   * @swagger
   * /api/exception-requests:
   *   get:
   *     summary: Get a list of exception requests
   *     tags: [ExceptionRequests]
   *     parameters:
   *       - name: page
   *         in: query
   *         required: false
   *         description: The page number
   *         schema:
   *           type: integer
   *       - name: limit
   *         in: query
   *         required: false
   *         description: The number of records per page
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: A list of exception requests
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                     per_page:
   *                       type: integer
   *                     current_page:
   *                       type: integer
   *                     last_page:
   *                       type: integer
   *                     first_page:
   *                       type: integer
   *                     resources:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           employeeId:
   *                             type: integer
   *                           exceptionTypeId:
   *                             type: integer
   *                           exceptionRequestStatus:
   *                             type: string
   *                           exceptionRequestDescription:
   *                             type: string
   */

  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const exceptionRequests = await ExceptionRequest.query().paginate(page, limit)

    return response.status(200).json(
      formatResponse(
        'success',
        'Successfully fetched',
        'Resources fetched',
        exceptionRequests.all(),
        {
          total: exceptionRequests.total,
          per_page: exceptionRequests.perPage,
          current_page: exceptionRequests.currentPage,
          last_page: exceptionRequests.lastPage,
          first_page: 1,
        }
      )
    )
  }
  /**
   * @swagger
   * /api/exception-requests:
   *   post:
   *     summary: Create a new exception request
   *     tags: [ExceptionRequests]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               employeeId:
   *                 type: integer
   *               exceptionTypeId:
   *                 type: integer
   *               exceptionRequestStatus:
   *                 type: string
   *                 enum: [requested, pending, accepted, refused]
   *               exceptionRequestDescription:
   *                 type: string
   *                 maxLength: 255
   *     responses:
   *       201:
   *         description: Exception request created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     employeeId:
   *                       type: integer
   *                     exceptionTypeId:
   *                       type: integer
   *                     exceptionRequestStatus:
   *                       type: string
   *                     exceptionRequestDescription:
   *                       type: string
   */

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(storeExceptionRequestValidator)
    const exceptionRequest = await ExceptionRequest.create(data)

    return response
      .status(201)
      .json(
        formatResponse(
          'success',
          'Successfully created',
          'Resource created',
          exceptionRequest.toJSON()
        )
      )
  }

  /**
   * @swagger
   * /api/exception-requests/{id}:
   *   get:
   *     summary: Get a specific exception request by ID
   *     tags: [ExceptionRequests]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the exception request
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Exception request found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     employeeId:
   *                       type: integer
   *                     exceptionTypeId:
   *                       type: integer
   *                     exceptionRequestStatus:
   *                       type: string
   *                     exceptionRequestDescription:
   *                       type: string
   *       404:
   *         description: Exception request not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const exceptionRequest = await ExceptionRequest.findOrFail(params.id)
      return response
        .status(200)
        .json(
          formatResponse(
            'success',
            'Successfully fetched',
            'Resource fetched',
            exceptionRequest.toJSON()
          )
        )
    } catch {
      return response
        .status(404)
        .json(formatResponse('error', 'Not Found', 'Resource not found', 'NO DATA'))
    }
  }

  /**
   * @swagger
   * /api/exception-requests/{id}:
   *   put:
   *     summary: Update an existing exception request
   *     tags: [ExceptionRequests]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the exception request
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               exceptionRequestStatus:
   *                 type: string
   *                 enum: [requested, pending, accepted, refused]
   *               exceptionRequestDescription:
   *                 type: string
   *                 maxLength: 255
   *     responses:
   *       200:
   *         description: Exception request updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     employeeId:
   *                       type: integer
   *                     exceptionTypeId:
   *                       type: integer
   *                     exceptionRequestStatus:
   *                       type: string
   *                     exceptionRequestDescription:
   *                       type: string
   *       404:
   *         description: Exception request not found
   */

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateExceptionRequestValidator)
    const exceptionRequest = await ExceptionRequest.findOrFail(params.id)
    exceptionRequest.merge(data)
    await exceptionRequest.save()

    return response
      .status(200)
      .json(
        formatResponse(
          'success',
          'Successfully updated',
          'Resource updated',
          exceptionRequest.toJSON()
        )
      )
  }

  /**
   * @swagger
   * /api/exception-requests/{id}:
   *   delete:
   *     summary: Delete an exception request by ID
   *     tags: [ExceptionRequests]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the exception request
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Exception request deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 message:
   *                   type: string
   *                 data:
   *                   type: string
   *        404:
   *         description: Exception request not found
   */

  async destroy({ params, response }: HttpContext) {
    const exceptionRequest = await ExceptionRequest.findOrFail(params.id)
    await exceptionRequest.delete()

    return response
      .status(200)
      .json(formatResponse('success', 'Successfully deleted', 'Resource deleted', 'DELETED'))
  }
}
