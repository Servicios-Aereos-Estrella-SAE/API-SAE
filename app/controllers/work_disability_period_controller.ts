import { HttpContext } from '@adonisjs/core/http'
import WorkDisabilityPeriod from '#models/work_disability_period'
import WorkDisabilityPeriodService from '#services/work_disability_period_service'
import UploadService from '#services/upload_service'
import { createWorkDisabilityPeriodValidator } from '#validators/work_disability_period'
import { DateTime } from 'luxon'
import ShiftException from '#models/shift_exception'
import { ShiftExceptionErrorInterface } from '../interfaces/shift_exception_error_interface.js'
import ExceptionType from '#models/exception_type'
import ShiftExceptionService from '#services/shift_exception_service'

export default class WorkDisabilityPeriodController {
  /**
   * @swagger
   * /api/work-disability-periods:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Work Disability Periods
   *     summary: create new work disability period
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               workDisabilityPeriodStartDate:
   *                 type: string
   *                 format: date
   *                 description: Work disability period start date (YYYY-MM-DD)
   *                 example: "2025-01-08"
   *                 required: true
   *               workDisabilityPeriodEndDate:
   *                 type: string
   *                 format: date
   *                 description: Work disability period end date (YYYY-MM-DD)
   *                 example: "2025-01-08"
   *                 required: true
   *               workDisabilityPeriodTicketFolio:
   *                 type: number
   *                 description: Work disability period ticket folio
   *                 required: true
   *                 default: ''
   *               workDisabilityPeriodFile:
   *                 type: string
   *                 format: binary
   *                 description: Work disability period file to upload
   *               workDisabilityId:
   *                 type: number
   *                 description: Work disability id
   *                 required: true
   *                 default: ''
   *               workDisabilityTypeId:
   *                 type: number
   *                 description: Work disability type Id
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
  async store({ request, response, auth }: HttpContext) {
    try {
      const workDisabilityPeriodStartDate = request.input('workDisabilityPeriodStartDate')
      const workDisabilityPeriodEndDate = request.input('workDisabilityPeriodEndDate')
      const workDisabilityPeriodTicketFolio = request.input('workDisabilityPeriodTicketFolio')
      const workDisabilityId = request.input('workDisabilityId')
      const workDisabilityTypeId = request.input('workDisabilityTypeId')
      const workDisabilityPeriod = {
        workDisabilityPeriodStartDate: workDisabilityPeriodStartDate,
        workDisabilityPeriodEndDate: workDisabilityPeriodEndDate,
        workDisabilityPeriodTicketFolio: workDisabilityPeriodTicketFolio,
        workDisabilityId: workDisabilityId,
        workDisabilityTypeId: workDisabilityTypeId,
      } as WorkDisabilityPeriod
      const workDisabilityPeriodService = new WorkDisabilityPeriodService()
      const data = await request.validateUsing(createWorkDisabilityPeriodValidator)
      const exist = await workDisabilityPeriodService.verifyInfoExist(workDisabilityPeriod)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await workDisabilityPeriodService.verifyInfo(workDisabilityPeriod)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }

      const validationOptions = {
        types: ['image', 'document', 'text', 'application', 'archive'],
        size: '',
      }
      const workDisabilityPeriodFile = request.file('workDisabilityPeriodFile', validationOptions)
      if (workDisabilityPeriodFile) {
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']
        if (!allowedExtensions.includes(workDisabilityPeriodFile.extname || '')) {
          response.status(400)
          return {
            status: 400,
            type: 'warning',
            title: 'Please upload a valid file',
            message: 'Only PDF or image files are allowed',
          }
        }
        const fileName = `${new Date().getTime()}_${workDisabilityPeriodFile.clientName}`
        const uploadService = new UploadService()
        const fileUrl = await uploadService.fileUpload(
          workDisabilityPeriodFile,
          'work-disability-files',
          fileName
        )
        workDisabilityPeriod.workDisabilityPeriodFile = fileUrl
      }
      const shiftExceptionsSaved = [] as Array<ShiftException>
      const shiftExceptionsError = [] as Array<ShiftExceptionErrorInterface>
      const newWorkDisabilityPeriod = await workDisabilityPeriodService.create(workDisabilityPeriod)
      if (newWorkDisabilityPeriod) {
        const workDisabilityExceptionType = await ExceptionType.query()
          .whereNull('exception_type_deleted_at')
          .where('exception_type_slug', 'falta-por-incapacidad')
          .first()
        if (workDisabilityExceptionType) {
          await newWorkDisabilityPeriod.load('workDisability')
          let currentDate = DateTime.fromISO(workDisabilityPeriodStartDate)
          const endDate = DateTime.fromISO(workDisabilityPeriodEndDate)
          for await (const date of workDisabilityPeriodService.iterateDates(currentDate, endDate)) {
            const shiftException = {
              employeeId: newWorkDisabilityPeriod.workDisability.employeeId,
              shiftExceptionsDescription: '',
              shiftExceptionsDate: date.toISODate(),
              exceptionTypeId: workDisabilityExceptionType.exceptionTypeId,
              vacationSettingId: null,
              shiftExceptionCheckInTime: null,
              shiftExceptionCheckOutTime: null,
              shiftExceptionEnjoymentOfSalary: null,
              shiftExceptionTimeByTime: null,
            } as ShiftException
            try {
              const shiftExceptionService = new ShiftExceptionService()
              const verifyInfoException = await shiftExceptionService.verifyInfo(shiftException)
              if (verifyInfoException.status !== 200) {
                shiftExceptionsError.push({
                  shiftExceptionsDate: date.toISODate(),
                  error: verifyInfoException.message,
                })
              } else {
                const newShiftException = await shiftExceptionService.create(shiftException)
                if (newShiftException) {
                  const rawHeaders = request.request.rawHeaders
                  const userId = auth.user?.userId
                  if (userId) {
                    const logShiftException = await shiftExceptionService.createActionLog(
                      rawHeaders,
                      'store'
                    )
                    logShiftException.user_id = userId
                    logShiftException.record_current = JSON.parse(JSON.stringify(newShiftException))
                    const exceptionType = await ExceptionType.query()
                      .whereNull('exception_type_deleted_at')
                      .where('exception_type_slug', 'vacation')
                      .first()
                    let table = 'log_shift_exceptions'
                    if (exceptionType) {
                      if (exceptionType.exceptionTypeId === newShiftException.exceptionTypeId) {
                        table = 'log_vacations'
                      }
                    }
                    await shiftExceptionService.saveActionOnLog(logShiftException, table)
                  }
                  await newShiftException.load('exceptionType')
                  await newShiftException.load('vacationSetting')
                  shiftExceptionsSaved.push(newShiftException)
                }
              }
            } catch (error) {
              shiftExceptionsError.push({
                shiftExceptionsDate: date.toISODate(),
                error: error.message,
              })
            }
          }
        }
        response.status(201)
        return {
          type: 'success',
          title: 'Work disability periods',
          message: 'The work disability period was created successfully',
          data: {
            workDisabilityPeriod: newWorkDisabilityPeriod,
            shiftExceptionsSaved: shiftExceptionsSaved,
            shiftExceptionsError: shiftExceptionsError,
          },
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
   * /api/work-disability-periods/{workDisabilityPeriodId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Work Disability Periods
   *     summary: get work disability period by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: workDisabilityPeriodId
   *         schema:
   *           type: number
   *         description: Work disability period Id
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
      const workDisabilityPeriodId = request.param('workDisabilityPeriodId')
      if (!workDisabilityPeriodId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The work disability period Id was not found',
          data: { workDisabilityPeriodId },
        }
      }
      const workDisabilityPeriodService = new WorkDisabilityPeriodService()
      const showWorkDisabilityPeriod =
        await workDisabilityPeriodService.show(workDisabilityPeriodId)
      if (!showWorkDisabilityPeriod) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The work disability period was not found',
          message: 'The work disability period was not found with the entered ID',
          data: { workDisabilityPeriodId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Work disability periods',
          message: 'The work disability period was found successfully',
          data: { workDisabilityPeriod: showWorkDisabilityPeriod },
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
