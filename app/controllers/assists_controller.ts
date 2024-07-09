import SyncAssistsService from '#services/sync_assists_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import ExcelJS from 'exceljs'
import axios from 'axios'
import { DateTime } from 'luxon'
import { AssistDayInterface } from '../interfaces/assist_day_interface.js'
import Employee from '#models/employee'

export default class AssistsController {
  /**
   * @swagger
   * /api/v1/assists/synchronize:
   *   post:
   *     summary: Synchronize assists
   *     security:
   *       - bearerAuth: []
   *     tags: [Assists]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               date:
   *                 type: string
   *                 format: date
   *                 example: "2023-01-01"
   *               page:
   *                 type: number
   *                 example: "1"
   *     responses:
   *       200:
   *         description: Synchronization started
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Proceso de sincronización iniciado
   *       400:
   *         description: Synchronization in progress or other error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Ya se encuentra un proceso en sincronización, por favor espere
   */
  @inject()
  async synchronize({ request, response }: HttpContext, syncAssistsService: SyncAssistsService) {
    const dateParamApi = request.input('date')
    const page = request.input('page')

    try {
      const result = await syncAssistsService.synchronize(dateParamApi, page)
      return response.status(200).json(result)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }
  /**
   * @swagger
   * /api/v1/assists/status:
   *   get:
   *     summary: Retrieve the status of the sync assists operation
   *     tags: [Assists]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Status retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AssistStatusResponseDto'
   *       400:
   *         description: Error retrieving status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Error al obtener el estado de sincronización"
   */
  @inject()
  async getStatusSync({ response }: HttpContext, syncAssistsService: SyncAssistsService) {
    return response.status(200).json(await syncAssistsService.getStatusSync())
  }

  /**
   * @swagger
   * /api/v1/assists:
   *   get:
   *     summary: get assists list
   *     security:
   *       - bearerAuth: []
   *     tags: [Assists]
   *     parameters:
   *       - name: date
   *         in: query
   *         required: true
   *         schema:
   *           type: string
   *         default: "2023-01-01"
   *         description: Date from get list
   *       - name: date-end
   *         in: query
   *         required: true
   *         schema:
   *           type: string
   *         default: "2024-12-31"
   *         description: Date limit to get list
   *       - name: employeeId
   *         in: query
   *         required: true
   *         schema:
   *           type: number
   *         description: Number of limit on paginator page
   *     responses:
   *       200:
   *         description: Resource action successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example: {}
   *       400:
   *         description: Invalid data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async index({ request, response }: HttpContext) {
    const syncAssistsService = new SyncAssistsService()
    const employeeID = request.input('employeeId')
    const filterDate = request.input('date')
    const filterDateEnd = request.input('date-end')
    const page = request.input('page')
    const limit = request.input('limit')

    try {
      const result = await syncAssistsService.index(
        {
          date: filterDate,
          dateEnd: filterDateEnd,
          employeeID: employeeID,
        },
        { page, limit }
      )
      return response.status(result.status).json(result)
    } catch (error) {
      return response.status(400).json({
        type: 'success',
        title: 'Successfully action',
        message: error.message,
        data: error.response || null,
      })
    }
  }

  /**
   * @swagger
   * /api/v1/assists/get-excel:
   *   get:
   *     summary: get assists excel
   *     security:
   *       - bearerAuth: []
   *     tags: [Assists]
   *     parameters:
   *       - name: date
   *         in: query
   *         required: true
   *         schema:
   *           type: string
   *         default: "2023-01-01"
   *         description: Date from get list
   *       - name: date-end
   *         in: query
   *         required: true
   *         schema:
   *           type: string
   *         default: "2024-12-31"
   *         description: Date limit to get list
   *       - name: employeeId
   *         in: query
   *         required: true
   *         schema:
   *           type: number
   *         description: Employee id
   *     responses:
   *       200:
   *         description: Resource action successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example: {}
   *       400:
   *         description: Invalid data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async getExcel({ request, response }: HttpContext) {
    try {
      const employeeID = request.input('employeeId')
      const filterDate = request.input('date')
      const filterDateEnd = request.input('date-end')
      let apiUrl = `http://${env.get('HOST')}:${env.get('PORT')}/api/v1/assists`
      apiUrl = `${apiUrl}?date=${filterDate || ''}`
      apiUrl = `${apiUrl}&date-end=${filterDateEnd || ''}`
      apiUrl = `${apiUrl}&employeeId=${employeeID || ''}`
      const apiResponse = await axios.get(apiUrl)
      const data = apiResponse.data.data
      //console.log(data)
      //console.log(data)
      const employee = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('employee_id', employeeID)
        .preload('position')
        .first()
      if (!employee) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Excel assist by employee',
          message: 'Missing data to process',
          data: {},
        }
      }
      const rows = []
      if (data) {
        for await (const calendar of data.employeeCalendar) {
          // console.log(calendar)
          const day = this.dateDay(calendar.day)
          const month = this.dateMonth(calendar.day)
          const year = this.dateYear(calendar.year)
          const calendarDay = this.calendarDay(year, month, day)
          const weekDayName = this.weekDayName(year, month, day)
          const firstCheck = this.chekInTime(calendar)
          const lastCheck = this.chekOutTime(calendar)
          const checkInTime = DateTime.fromFormat(
            calendar.assist.dateShift.shiftTimeStart,
            'HH:mm:ss'
          )
          const checkOutTime = checkInTime
            .plus({ hours: calendar.assist.dateShift.shiftActiveHours })
            .toFormat('ff')

          rows.push({
            name: `${employee.employeeFirstName} ${employee.employeeLastName}`,
            position: employee.position.positionName ? employee.position.positionName : '',
            date: calendarDay,
            dayOfWeek: weekDayName,
            checkInTime: checkInTime.toFormat('ff'),
            firstCheck: firstCheck,
            lunchTime: '',
            returnLunchTime: '',
            checkOutTime: checkOutTime,
            lastCheck: lastCheck,
            incidents: '',
            notes: '',
            sundayPremium: '',
          })
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')

      // Agregar título del reporte en negritas
      const titleRow = worksheet.addRow(['REGISTROS DE ASISTENCIA '])
      titleRow.font = { bold: true, size: 24 }
      titleRow.height = 20
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A1:M1')

      const periodRow = worksheet.addRow([`Fecha desde ${filterDate} hasta ${filterDateEnd}`])
      periodRow.font = { size: 15 }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:M2')

      // Añadir columnas de datos (encabezados)
      const headerRow = worksheet.addRow([
        'Nombre',
        'Cargo',
        'Fecha',
        'Día de Semana',
        'Hora entrada',
        'Check Entrada',
        'Hora salida a comer',
        'Hora regreso de comer',
        'Hora Salida',
        'Check Salida',
        'Incidencias',
        'Notas',
        'Prima Dominical',
      ])
      headerRow.font = { bold: true }
      // Añadir filas de datos (esto es un ejemplo, puedes obtener estos datos de tu base de datos)
      rows.forEach((rowData) => {
        worksheet.addRow([
          rowData.name,
          rowData.position,
          rowData.date,
          rowData.dayOfWeek,
          rowData.checkInTime,
          rowData.firstCheck,
          rowData.lunchTime,
          rowData.returnLunchTime,
          rowData.checkOutTime,
          rowData.lastCheck,
          rowData.incidents,
          rowData.notes,
          rowData.sundayPremium,
        ])
      })
      const columnA = worksheet.getColumn(1)
      columnA.width = 44
      const columnB = worksheet.getColumn(2)
      columnB.width = 44
      const columnC = worksheet.getColumn(3)
      columnC.width = 14
      columnC.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnD = worksheet.getColumn(4)
      columnD.width = 14
      columnD.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnE = worksheet.getColumn(5)
      columnE.width = 25
      columnE.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnF = worksheet.getColumn(6)
      columnF.width = 25
      columnF.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnG = worksheet.getColumn(7)
      columnG.width = 25
      columnG.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnH = worksheet.getColumn(8)
      columnH.width = 25
      columnH.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnI = worksheet.getColumn(9)
      columnI.width = 25
      columnI.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnJ = worksheet.getColumn(10)
      columnJ.width = 25
      columnJ.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnK = worksheet.getColumn(11)
      columnK.width = 30
      columnK.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnL = worksheet.getColumn(12)
      columnL.width = 30
      columnL.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnM = worksheet.getColumn(13)
      columnM.width = 30
      columnM.alignment = { vertical: 'middle', horizontal: 'center' }

      // response.status(200)
      // return true
      // Crear un buffer del archivo Excel
      const buffer = await workbook.xlsx.writeBuffer()

      // Enviar la respuesta con el buffer del archivo Excel y la información adicional
      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      response.header('Content-Disposition', 'attachment; filename=datos.xlsx')
      response.send(buffer)
      // return response.status(200).json(d)
    } catch (error) {
      return response.status(400).json({
        type: 'success',
        title: 'Successfully action',
        message: error.message,
        data: error.response || null,
      })
    }
  }

  dateYear(day: string) {
    if (!day) {
      return 0
    }

    const year = Number.parseInt(`${day.split('-')[0]}`)
    return year
  }

  dateMonth(day: string) {
    if (!day) {
      return 0
    }

    const month = Number.parseInt(`${day.split('-')[1]}`)
    return month
  }

  dateDay(day: string) {
    if (!day) {
      return 0
    }

    const dayTemp = Number.parseInt(`${day.split('-')[2]}`)
    return dayTemp
  }

  weekDayName(dateYear: number, dateMonth: number, dateDay: number) {
    const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
    const day = date.toFormat('cccc')
    return day
  }

  calendarDay(dateYear: number, dateMonth: number, dateDay: number) {
    const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
    const day = date.toFormat('DD')
    return day
  }

  chekInTime(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.checkIn?.assistPunchTimeOrigin) {
      return ''
    }

    const time = DateTime.fromISO(checkAssist.assist.checkIn.assistPunchTimeOrigin.toString(), {
      setZone: true,
    })
    const timeCST = time.setZone('UTC-5')
    return timeCST.toFormat('ff')
  }

  chekOutTime(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.checkOut?.assistPunchTimeOrigin) {
      return ''
    }

    const now = DateTime.now().toFormat('yyyy-LL-dd')
    const time = DateTime.fromISO(checkAssist.assist.checkOut.assistPunchTimeOrigin.toString(), {
      setZone: true,
    })
    const timeDate = time.toFormat('yyyy-LL-dd')
    const timeCST = time.setZone('UTC-5')

    if (timeDate === now) {
      checkAssist.assist.checkOutStatus = ''
      return ''
    }

    return timeCST.toFormat('ff')
  }
}
