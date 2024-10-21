import ProceedingFileTypeEmail from '#models/proceeding_file_type_email'
import ProceedingFileTypeEmailService from '#services/proceeding_file_type_email_service'
import {
  createProceedingFileTypeEmailValidator,
  updateProceedingFileTypeEmailValidator,
} from '#validators/proceeding_file_type_email'
import { HttpContext } from '@adonisjs/core/http'

export default class ProceedingFileTypeEmailController {
  /**
   * @swagger
   * /api/proceeding-file-type-emails/:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Proceeding File Types Emails
   *     summary: get all proceeding file type email
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
      const proceedingFileTypeEmailService = new ProceedingFileTypeEmailService()
      const showProceedingFileTypeEmails = await proceedingFileTypeEmailService.index()
      response.status(200)
      return {
        type: 'success',
        title: 'Proceeding file types emails',
        message: 'The proceeding file type email were found successfully',
        data: { proceedingFileTypeEmails: showProceedingFileTypeEmails },
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
   * /api/proceeding-file-type-emails:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Proceeding File Types Emails
   *     summary: create new proceeding file type email
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               proceedingFileTypeId:
   *                 type: number
   *                 description: Proceeding file type id
   *                 required: true
   *                 default: ''
   *               proceedingFileTypeEmailEmail:
   *                 type: string
   *                 description: Proceeding file type email email
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
      const proceedingFileTypeId = request.input('proceedingFileTypeId')
      const proceedingFileTypeEmailEmail = request.input('proceedingFileTypeEmailEmail')
      const proceedingFileTypeEmail = {
        proceedingFileTypeId: proceedingFileTypeId,
        proceedingFileTypeEmailEmail: proceedingFileTypeEmailEmail,
      } as ProceedingFileTypeEmail
      const proceedingFileTypeEmailService = new ProceedingFileTypeEmailService()
      const data = await request.validateUsing(createProceedingFileTypeEmailValidator)
      const exist = await proceedingFileTypeEmailService.verifyInfoExist(proceedingFileTypeEmail)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await proceedingFileTypeEmailService.verifyInfo(proceedingFileTypeEmail)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const newProceedingFileTypeEmail =
        await proceedingFileTypeEmailService.create(proceedingFileTypeEmail)
      if (newProceedingFileTypeEmail) {
        response.status(201)
        return {
          type: 'success',
          title: 'Proceeding file types emails',
          message: 'The proceeding file type email was created successfully',
          data: { proceedingFileTypeEmail: newProceedingFileTypeEmail },
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
   * /api/proceeding-file-type-emails/{proceedingFileTypeEmailId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Proceeding File Types Emails
   *     summary: update proceeding file type email
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: proceedingFileTypeEmailId
   *         schema:
   *           type: number
   *         description: Proceeding file type email id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               proceedingFileTypeId:
   *                 type: number
   *                 description: Proceeding file type id
   *                 required: true
   *                 default: ''
   *               proceedingFileTypeEmailEmail:
   *                 type: string
   *                 description: Proceeding file type email email
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
      const proceedingFileTypeEmailId = request.param('proceedingFileTypeEmailId')
      const proceedingFileTypeId = request.input('proceedingFileTypeId')
      const proceedingFileTypeEmailEmail = request.input('proceedingFileTypeEmailEmail')
      const proceedingFileTypeEmail = {
        proceedingFileTypeEmailId: proceedingFileTypeEmailId,
        proceedingFileTypeId: proceedingFileTypeId,
        proceedingFileTypeEmailEmail: proceedingFileTypeEmailEmail,
      } as ProceedingFileTypeEmail
      if (!proceedingFileTypeEmailId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The proceeding file type email Id was not found',
          message: 'Missing data to process',
          data: { ...proceedingFileTypeEmail },
        }
      }
      const currentProceedingFileTypeEmail = await ProceedingFileTypeEmail.query()
        .whereNull('proceeding_file_type_email_deleted_at')
        .where('proceeding_file_type_email_id', proceedingFileTypeEmailId)
        .first()
      if (!currentProceedingFileTypeEmail) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The proceeding file type email was not found',
          message: 'The proceeding file type email was not found with the entered ID',
          data: { ...proceedingFileTypeEmail },
        }
      }
      const proceedingFileTypeEmailService = new ProceedingFileTypeEmailService()
      const data = await request.validateUsing(updateProceedingFileTypeEmailValidator)
      const exist = await proceedingFileTypeEmailService.verifyInfoExist(proceedingFileTypeEmail)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await proceedingFileTypeEmailService.verifyInfo(proceedingFileTypeEmail)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const updateProceedingFileTypeEmail = await proceedingFileTypeEmailService.update(
        currentProceedingFileTypeEmail,
        proceedingFileTypeEmail
      )
      if (updateProceedingFileTypeEmail) {
        response.status(200)
        return {
          type: 'success',
          title: 'Proceeding file type emails',
          message: 'The proceeding file type email was updated successfully',
          data: { proceedingFileTypeEmail: updateProceedingFileTypeEmail },
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
   * /api/proceeding-file-type-emails/{proceedingFileTypeEmailId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Proceeding File Types Emails
   *     summary: delete proceeding file type email
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: proceedingFileTypeEmailId
   *         schema:
   *           type: number
   *         description: Proceeding file type email id
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
      const proceedingFileTypeEmailId = request.param('proceedingFileTypeEmailId')
      if (!proceedingFileTypeEmailId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The proceeding file type email Id was not found',
          message: 'Missing data to process',
          data: { proceedingFileTypeEmailId },
        }
      }
      const currentProceedingFileTypeEmail = await ProceedingFileTypeEmail.query()
        .whereNull('proceeding_file_type_email_deleted_at')
        .where('proceeding_file_type_email_id', proceedingFileTypeEmailId)
        .first()
      if (!currentProceedingFileTypeEmail) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The proceeding file type email was not found',
          message: 'The proceeding file type email was not found with the entered ID',
          data: { proceedingFileTypeEmailId },
        }
      }
      const proceedingFileTypeEmailService = new ProceedingFileTypeEmailService()
      const deleteProceedingFileTypeEmail = await proceedingFileTypeEmailService.delete(
        currentProceedingFileTypeEmail
      )
      if (deleteProceedingFileTypeEmail) {
        response.status(200)
        return {
          type: 'success',
          title: 'Proceeding file types emails',
          message: 'The proceeding file type email was deleted successfully',
          data: { proceedingFileTypeEmail: deleteProceedingFileTypeEmail },
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
   * /api/proceeding-file-type-emails/{proceedingFileTypeEmailId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Proceeding File Types Emails
   *     summary: get proceeding file type email by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: proceedingFileTypeEmailId
   *         schema:
   *           type: number
   *         description: Proceeding file type email id
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
      const proceedingFileTypeEmailId = request.param('proceedingFileTypeEmailId')
      if (!proceedingFileTypeEmailId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The proceeding file type email Id was not found',
          data: { proceedingFileTypeEmailId },
        }
      }
      const proceedingFileTypeEmailService = new ProceedingFileTypeEmailService()
      const showProceedingFileTypeEmail =
        await proceedingFileTypeEmailService.show(proceedingFileTypeEmailId)
      if (!showProceedingFileTypeEmail) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The proceeding file type email was not found',
          message: 'The proceeding file type email was not found with the entered ID',
          data: { proceedingFileTypeEmailId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Proceeding file types emails',
          message: 'The proceeding file type email was found successfully',
          data: { proceedingFileTypeEmail: showProceedingFileTypeEmail },
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
