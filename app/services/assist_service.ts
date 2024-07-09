import { DateTime } from 'luxon'
import { AssistDayInterface } from '../interfaces/assist_day_interface.js'
import { AssistEmployeeExcelFilterInterface } from '../interfaces/assist_employee_excel_filter_interface.js'
import ExcelJS from 'exceljs'
import Employee from '#models/employee'
import axios from 'axios'
import env from '#start/env'

export default class AssistsService {
  async getExcelByEmployee(employee: Employee, filters: AssistEmployeeExcelFilterInterface) {
    try {
      const employeeID = filters.employeeId
      const filterDate = filters.filterDate
      const filterDateEnd = filters.filterDateEnd
      let apiUrl = `http://${env.get('HOST')}:${env.get('PORT')}/api/v1/assists`
      apiUrl = `${apiUrl}?date=${filterDate || ''}`
      apiUrl = `${apiUrl}&date-end=${filterDateEnd || ''}`
      apiUrl = `${apiUrl}&employeeId=${employeeID || ''}`
      const apiResponse = await axios.get(apiUrl)
      const data = apiResponse.data.data
      const rows = []
      if (data) {
        for await (const calendar of data.employeeCalendar) {
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
      // Crear un buffer del archivo Excel
      const buffer = await workbook.xlsx.writeBuffer()
      return {
        status: 201,
        type: 'success',
        title: 'Excel',
        message: 'Excel was created successfully',
        buffer: buffer,
      }
    } catch (error) {
      return {
        status: 500,
        type: 'error',
        title: 'Server Error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }
  private dateYear(day: string) {
    if (!day) {
      return 0
    }

    const year = Number.parseInt(`${day.split('-')[0]}`)
    return year
  }

  private dateMonth(day: string) {
    if (!day) {
      return 0
    }

    const month = Number.parseInt(`${day.split('-')[1]}`)
    return month
  }

  private dateDay(day: string) {
    if (!day) {
      return 0
    }

    const dayTemp = Number.parseInt(`${day.split('-')[2]}`)
    return dayTemp
  }

  private weekDayName(dateYear: number, dateMonth: number, dateDay: number) {
    const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
    const day = date.toFormat('cccc')
    return day
  }

  private calendarDay(dateYear: number, dateMonth: number, dateDay: number) {
    const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
    const day = date.toFormat('DD')
    return day
  }

  private chekInTime(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.checkIn?.assistPunchTimeOrigin) {
      return ''
    }

    const time = DateTime.fromISO(checkAssist.assist.checkIn.assistPunchTimeOrigin.toString(), {
      setZone: true,
    })
    const timeCST = time.setZone('UTC-5')
    return timeCST.toFormat('ff')
  }

  private chekOutTime(checkAssist: AssistDayInterface) {
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
