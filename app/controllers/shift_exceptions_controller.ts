import ShiftExceptionService from '#services/shift_exception_service'
import { DateTime } from 'luxon'
import { ShiftExceptionFilterInterface } from '../interfaces/shift_exception_filter_interface.js'
import ShiftException from '../models/shift_exception.js'
import { createShiftExceptionValidator } from '../validators/shift_exception.js'
import { HttpContext } from '@adonisjs/core/http'
import Employee from '#models/employee'
import ExcelJS from 'exceljs'
import axios from 'axios'

export default class ShiftExceptionController {
  /**
   * @swagger
   * /api/shift-exception:
   *   get:
   *     summary: Retrieve a list of shift exceptions
   *     tags: [ShiftException]
   *     responses:
   *       200:
   *         description: A list of shift exceptions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/ShiftException'
   *       500:
   *         description: Server error
   */
  async index({ response }: HttpContext) {
    try {
      const shiftExceptions = await ShiftException.all()
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resources fetched',
        data: shiftExceptions,
      })
    } catch (error) {
      return response.status(500).json({
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error occurred',
        data: null,
      })
    }
  }
  /**
   * @swagger
   * /api/shift-exception:
   *   post:
   *     summary: Create a new shift exception
   *     tags: [ShiftException]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ShiftException'
   *     responses:
   *       201:
   *         description: Shift exception created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShiftException'
   *       400:
   *         description: Validation error
   */
  async store({ request, response }: HttpContext) {
    try {
      const employeeId = request.input('employeeId')
      const shiftExceptionsDescription = request.input('shiftExceptionsDescription')
      let shiftExceptionsDate = request.input('shiftExceptionsDate')
      if (shiftExceptionsDate.toString().length <= 10) {
        shiftExceptionsDate = shiftExceptionsDate
          ? DateTime.fromJSDate(new Date(`${shiftExceptionsDate}T00:00:00.000-06:00`))
              .setZone('UTC')
              .toJSDate()
          : null
      } else {
        shiftExceptionsDate = shiftExceptionsDate
          ? DateTime.fromJSDate(new Date(shiftExceptionsDate)).setZone('UTC').toJSDate()
          : null
      }
      const exceptionTypeId = request.input('exceptionTypeId')
      const vacationSettingId = request.input('vacationSettingId')
      await request.validateUsing(createShiftExceptionValidator)
      const shiftExceptionService = new ShiftExceptionService()
      const shiftException = {
        employeeId: employeeId,
        shiftExceptionsDescription: shiftExceptionsDescription,
        shiftExceptionsDate: shiftExceptionsDate,
        exceptionTypeId: exceptionTypeId,
        vacationSettingId: vacationSettingId ? vacationSettingId : null,
      } as ShiftException
      const verifyInfo = await shiftExceptionService.verifyInfo(shiftException)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...shiftException },
        }
      }
      const newShiftException = await shiftExceptionService.create(shiftException)
      if (newShiftException) {
        await newShiftException.load('exceptionType')
        await newShiftException.load('vacationSetting')
        response.status(201)
        return {
          type: 'success',
          title: 'Shift exception',
          message: 'The shift exception was created successfully',
          data: { shiftException: newShiftException },
        }
      }
    } catch (error) {
      console.error('Error:', error)
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: error.messages,
        data: error,
      })
    }
  }
  /**
   * @swagger
   * /api/shift-exception/{id}:
   *   get:
   *     summary: Get a shift exception by ID
   *     tags: [ShiftException]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID of the shift exception to retrieve
   *     responses:
   *       200:
   *         description: Shift exception fetched
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShiftException'
   *       404:
   *         description: Shift exception not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const shiftException = await ShiftException.findOrFail(params.id)
      await shiftException.load('exceptionType')
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource fetched',
        data: shiftException,
      })
    } catch (error) {
      return response.status(404).json({
        type: 'error',
        title: 'Not found',
        message: 'Resource not found',
        data: null,
      })
    }
  }
  /**
   * @swagger
   * /api/shift-exception/{id}:
   *   put:
   *     summary: Update a shift exception by ID
   *     tags: [ShiftException]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID of the shift exception to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ShiftException'
   *     responses:
   *       200:
   *         description: Shift exception updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShiftException'
   *       400:
   *         description: Validation error
   *       404:
   *         description: Shift exception not found
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const employeeId = request.input('employeeId')
      const shiftExceptionsDescription = request.input('shiftExceptionsDescription')
      let shiftExceptionsDate = request.input('shiftExceptionsDate')
      if (shiftExceptionsDate.toString().length <= 10) {
        shiftExceptionsDate = shiftExceptionsDate
          ? DateTime.fromJSDate(new Date(`${shiftExceptionsDate}T00:00:00.000-06:00`))
              .setZone('UTC')
              .toJSDate()
          : null
      } else {
        shiftExceptionsDate = shiftExceptionsDate
          ? DateTime.fromJSDate(new Date(shiftExceptionsDate)).setZone('UTC').toJSDate()
          : null
      }
      const exceptionTypeId = request.input('exceptionTypeId')
      const vacationSettingId = request.input('vacationSettingId')
      await request.validateUsing(createShiftExceptionValidator)
      const shiftExceptionService = new ShiftExceptionService()
      const currentShiftException = await ShiftException.findOrFail(params.id)
      const shiftException = {
        shiftExceptionId: params.id,
        employeeId: employeeId,
        shiftExceptionsDescription: shiftExceptionsDescription,
        shiftExceptionsDate: shiftExceptionsDate,
        exceptionTypeId: exceptionTypeId,
        vacationSettingId: vacationSettingId ? vacationSettingId : null,
      } as ShiftException
      const verifyInfo = await shiftExceptionService.verifyInfo(shiftException)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...shiftException },
        }
      }
      const updateShiftException = await shiftExceptionService.update(
        currentShiftException,
        shiftException
      )
      if (updateShiftException) {
        await updateShiftException.load('exceptionType')
        await updateShiftException.load('vacationSetting')
        response.status(201)
        return {
          type: 'success',
          title: 'Shift exception',
          message: 'The shift exception was updated successfully',
          data: { shiftException: updateShiftException },
        }
      }
    } catch (error) {
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: error.messages,
        data: null,
      })
    }
  }
  /**
   * @swagger
   * /api/shift-exception/{id}:
   *   delete:
   *     summary: Delete a shift exception by ID
   *     tags: [ShiftException]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID of the shift exception to delete
   *     responses:
   *       200:
   *         description: Shift exception deleted
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShiftException'
   *       404:
   *         description: Shift exception not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const shiftException = await ShiftException.findOrFail(params.id)
      await shiftException.delete()
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource deleted',
        data: shiftException.toJSON(),
      })
    } catch (error) {
      return response.status(404).json({
        type: 'error',
        title: 'Not found',
        message: 'Resource not found',
        data: null,
      })
    }
  }

  /**
   * @swagger
   * /api/shift-exception-employee/{employeeId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - ShiftException
   *     summary: get shifts exceptions by employee
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: employeeId
   *         schema:
   *           type: number
   *         description: Employee id
   *         required: true
   *       - name: exceptionTypeId
   *         in: query
   *         required: false
   *         description: Exception type id
   *         schema:
   *           type: number
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
  async getByEmployee({ request, response }: HttpContext) {
    try {
      const employeeId = request.param('employeeId')
      const exceptionTypeId = request.input('exceptionTypeId')
      const dateStart = request.input('dateStart')
      const dateEnd = request.input('dateEnd')
      if (!employeeId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The employee Id was not found',
          message: 'Missing data to process',
          data: { employeeId },
        }
      }
      const filters = {
        employeeId: employeeId,
        exceptionTypeId: exceptionTypeId,
        dateStart: dateStart,
        dateEnd: dateEnd,
      } as ShiftExceptionFilterInterface
      const shiftExceptionService = new ShiftExceptionService()
      const shiftExceptions = await shiftExceptionService.getByEmployee(filters)
      response.status(200)
      return {
        type: 'success',
        title: 'Shift exceptions',
        message: 'The shift exceptions were found successfully',
        data: {
          shiftExceptions: shiftExceptions,
        },
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
   * /shift-exception/{employeeId}/export-excel:
   *   get:
   *     summary: Export shift exceptions of an employee to Excel
   *     description: Generates an Excel file containing shift exceptions for a specific employee, filtered by hire date and current date. Excludes exceptions of type "Día de descanso".
   *     tags:
   *       - ShiftException
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
        tl: { col: 0, row: 0 },
        ext: { width: 139, height: 49 },
      })
      worksheet.getRow(1).height = 60
      worksheet.mergeCells('A1:G1')

      const titleRow = worksheet.addRow(['Employee Shift Exceptions'])
      titleRow.font = { bold: true, size: 24, color: { argb: 'FFFFFFFF' } }
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:G2')
      worksheet.getCell('A2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '244062' },
      }

      const periodRow = worksheet.addRow([
        `From: ${hireDate.toLocaleDateString()} , ${currentDate.toLocaleDateString()}`,
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
        { key: 'shiftAssigned', width: 25 },
        { key: 'exceptionNotes', width: 30 },
      ]
      headerRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: colNumber <= 5 ? '538DD5' : '16365C' },
        }
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
      })

      shiftExceptions.forEach((exception) => {
        worksheet.addRow({
          employeeCode: employee.employeeCode,
          employeeName: `${employee.employeeFirstName} ${employee.employeeLastName}`,
          department: employee.department?.departmentName || 'N/A',
          position: employee.position?.positionName || 'N/A',
          date: exception.shiftExceptionsDate,
          shiftAssigned: exception.exceptionType?.exceptionTypeTypeName || 'N/A',
          exceptionNotes: exception.shiftExceptionsDescription || 'N/A',
        })
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
}
