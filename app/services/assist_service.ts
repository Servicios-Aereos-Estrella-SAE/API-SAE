import { DateTime } from 'luxon'
import { AssistDayInterface } from '../interfaces/assist_day_interface.js'
import { AssistEmployeeExcelFilterInterface } from '../interfaces/assist_employee_excel_filter_interface.js'
import ExcelJS from 'exceljs'
import Employee from '#models/employee'
import SyncAssistsService from './sync_assists_service.js'
import { AssistPositionExcelFilterInterface } from '../interfaces/assist_position_excel_filter_interface.js'
import EmployeeService from './employee_service.js'
import { AssistDepartmentExcelFilterInterface } from '../interfaces/assist_department_excel_filter_interface.js'
import DepartmentService from './department_service.js'
import { AssistExcelRowInterface } from '../interfaces/assist_excel_row_interface.js'
import { AssistExcelFilterInterface } from '../interfaces/assist_excel_filter_interface.js'
import Department from '#models/department'
import { ShiftExceptionInterface } from '../interfaces/shift_exception_interface.js'
import axios from 'axios'

export default class AssistsService {
  async getExcelByEmployee(employee: Employee, filters: AssistEmployeeExcelFilterInterface) {
    try {
      const employeeId = filters.employeeId
      const filterDate = filters.filterDate
      const filterDateEnd = filters.filterDateEnd
      const page = 1
      const limit = 999999999999999
      const syncAssistsService = new SyncAssistsService()
      const result = await syncAssistsService.index(
        {
          date: filterDate,
          dateEnd: filterDateEnd,
          employeeID: employeeId,
        },
        { page, limit }
      )
      const data: any = result.data
      const rows = [] as AssistExcelRowInterface[]
      if (data) {
        const employeeCalendar = data.employeeCalendar as AssistDayInterface[]
        let newRows = [] as AssistExcelRowInterface[]
        newRows = await this.addRowCalendar(employee, employeeCalendar)
        for await (const row of newRows) {
          rows.push(row)
        }
        this.addRowExcelEmpty(rows)
        this.addRowExcelEmptyWithCode(rows)
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')
      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0, nativeCol: 0, nativeColOff: 0, nativeRow: 0, nativeRowOff: 0 },
        ext: { width: 225, height: 80 },
      })
      worksheet.getRow(1).height = 87
      worksheet.mergeCells('A1:P1')
      const titleRow = worksheet.addRow(['Assistance Report'])
      let color = '244062'
      let fgColor = 'FFFFFFF'
      worksheet.getCell('A' + 2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      titleRow.font = { bold: true, size: 24, color: { argb: fgColor } }
      titleRow.height = 42
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:P2')
      color = '366092'
      const periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
      periodRow.font = { size: 15, color: { argb: fgColor } }

      worksheet.getCell('A' + 3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      periodRow.height = 30
      worksheet.mergeCells('A3:P3')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
        { state: 'frozen', ySplit: 4 }, // Fija la cuarta fila
      ]
      // Añadir columnas de datos (encabezados)
      // Añadir columnas de datos (encabezados)
      this.addHeadRow(worksheet)
      await this.addRowToWorkSheet(rows, worksheet)
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

  async getExcelByPosition(filters: AssistPositionExcelFilterInterface) {
    try {
      const departmentId = filters.departmentId
      const positionId = filters.positionId
      const filterDate = filters.filterDate
      const filterDateEnd = filters.filterDateEnd
      const page = 1
      const limit = 999999999999999
      const employeeService = new EmployeeService()
      const resultEmployes = await employeeService.index(
        {
          search: '',
          departmentId: departmentId,
          positionId: positionId,
          employeeWorkSchedule: '',
          page: page,
          limit: limit,
          ignoreDiscriminated: 1,
        },
        [departmentId]
      )
      const dataEmployes: any = resultEmployes
      const syncAssistsService = new SyncAssistsService()
      const rows = [] as AssistExcelRowInterface[]
      for await (const employee of dataEmployes) {
        const result = await syncAssistsService.index(
          {
            date: filterDate,
            dateEnd: filterDateEnd,
            employeeID: employee.employeeId,
          },
          { page, limit }
        )
        const data: any = result.data
        if (data) {
          const employeeCalendar = data.employeeCalendar as AssistDayInterface[]
          let newRows = [] as AssistExcelRowInterface[]
          newRows = await this.addRowCalendar(employee, employeeCalendar)
          for await (const row of newRows) {
            rows.push(row)
          }
          this.addRowExcelEmpty(rows)
          this.addRowExcelEmptyWithCode(rows)
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')
      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0, nativeCol: 0, nativeColOff: 0, nativeRow: 0, nativeRowOff: 0 },
        ext: { width: 225, height: 80 },
      })
      worksheet.getRow(1).height = 87
      worksheet.mergeCells('A1:P1')
      const titleRow = worksheet.addRow(['Assistance Report'])
      let color = '244062'
      let fgColor = 'FFFFFFF'
      worksheet.getCell('A' + 2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      titleRow.font = { bold: true, size: 24, color: { argb: fgColor } }
      titleRow.height = 42
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:P2')
      color = '366092'
      const periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
      periodRow.font = { size: 15, color: { argb: fgColor } }

      worksheet.getCell('A' + 3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      periodRow.height = 30
      worksheet.mergeCells('A3:P3')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
        { state: 'frozen', ySplit: 4 }, // Fija la cuarta fila
      ]
      // Añadir columnas de datos (encabezados)
      this.addHeadRow(worksheet)
      await this.addRowToWorkSheet(rows, worksheet)
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

  async getExcelByDepartment(filters: AssistDepartmentExcelFilterInterface) {
    try {
      const departmentId = filters.departmentId
      const filterDate = filters.filterDate
      const filterDateEnd = filters.filterDateEnd
      const page = 1
      const limit = 999999999999999
      const departmentService = new DepartmentService()
      const resultPositions = await departmentService.getPositions(departmentId)
      const syncAssistsService = new SyncAssistsService()
      const rows = [] as AssistExcelRowInterface[]
      for await (const position of resultPositions) {
        const employeeService = new EmployeeService()
        const resultEmployes = await employeeService.index(
          {
            search: '',
            departmentId: departmentId,
            positionId: position.positionId,
            employeeWorkSchedule: '',
            page: page,
            limit: limit,
            ignoreDiscriminated: 1,
          },
          [departmentId]
        )
        const dataEmployes: any = resultEmployes
        for await (const employee of dataEmployes) {
          const result = await syncAssistsService.index(
            {
              date: filterDate,
              dateEnd: filterDateEnd,
              employeeID: employee.employeeId,
            },
            { page, limit }
          )
          const data: any = result.data
          if (data) {
            const employeeCalendar = data.employeeCalendar as AssistDayInterface[]
            let newRows = [] as AssistExcelRowInterface[]
            newRows = await this.addRowCalendar(employee, employeeCalendar)
            for await (const row of newRows) {
              rows.push(row)
            }
            this.addRowExcelEmpty(rows)
            this.addRowExcelEmptyWithCode(rows)
          }
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')
      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0, nativeCol: 0, nativeColOff: 0, nativeRow: 0, nativeRowOff: 0 },
        ext: { width: 225, height: 80 },
      })
      worksheet.getRow(1).height = 87
      worksheet.mergeCells('A1:P1')
      const titleRow = worksheet.addRow(['Assistance Report'])
      let color = '244062'
      let fgColor = 'FFFFFFF'
      worksheet.getCell('A' + 2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      titleRow.font = { bold: true, size: 24, color: { argb: fgColor } }
      titleRow.height = 42
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:P2')
      color = '366092'
      const periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
      periodRow.font = { size: 15, color: { argb: fgColor } }

      worksheet.getCell('A' + 3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      periodRow.height = 30
      worksheet.mergeCells('A3:P3')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
        { state: 'frozen', ySplit: 4 }, // Fija la cuarta fila
      ]
      // Añadir columnas de datos (encabezados)
      this.addHeadRow(worksheet)
      await this.addRowToWorkSheet(rows, worksheet)
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

  async getExcelAll(filters: AssistExcelFilterInterface, departmentsList: Array<number>) {
    try {
      const departments = await Department.query()
        .whereNull('department_deleted_at')
        .whereIn('departmentId', departmentsList)
        .orderBy('departmentId')
      const rows = [] as AssistExcelRowInterface[]
      const filterDate = filters.filterDate
      const filterDateEnd = filters.filterDateEnd
      const departmentService = new DepartmentService()
      const employeeService = new EmployeeService()
      for await (const departmentRow of departments) {
        const departmentId = departmentRow.departmentId
        const page = 1
        const limit = 999999999999999
        const resultPositions = await departmentService.getPositions(departmentId)
        const syncAssistsService = new SyncAssistsService()
        for await (const position of resultPositions) {
          const resultEmployes = await employeeService.index(
            {
              search: '',
              departmentId: departmentId,
              positionId: position.positionId,
              page: page,
              limit: limit,
              employeeWorkSchedule: '',
              ignoreDiscriminated: 1,
            },
            [departmentId]
          )
          const dataEmployes: any = resultEmployes
          for await (const employee of dataEmployes) {
            const result = await syncAssistsService.index(
              {
                date: filterDate,
                dateEnd: filterDateEnd,
                employeeID: employee.employeeId,
              },
              { page, limit }
            )
            const data: any = result.data
            if (data) {
              const employeeCalendar = data.employeeCalendar as AssistDayInterface[]
              let newRows = [] as AssistExcelRowInterface[]
              newRows = await this.addRowCalendar(employee, employeeCalendar)
              for await (const row of newRows) {
                rows.push(row)
              }
              this.addRowExcelEmpty(rows)
              this.addRowExcelEmptyWithCode(rows)
            }
          }
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')
      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0, nativeCol: 0, nativeColOff: 0, nativeRow: 0, nativeRowOff: 0 },
        ext: { width: 225, height: 80 },
      })
      worksheet.getRow(1).height = 87
      worksheet.mergeCells('A1:P1')
      const titleRow = worksheet.addRow(['Assistance Report'])
      let color = '244062'
      let fgColor = 'FFFFFFF'
      worksheet.getCell('A' + 2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      titleRow.font = { bold: true, size: 24, color: { argb: fgColor } }
      titleRow.height = 42
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:P2')
      color = '366092'
      const periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
      periodRow.font = { size: 15, color: { argb: fgColor } }

      worksheet.getCell('A' + 3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      periodRow.height = 30
      worksheet.mergeCells('A3:P3')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
        { state: 'frozen', ySplit: 4 }, // Fija la cuarta fila
      ]
      // Añadir columnas de datos (encabezados)
      this.addHeadRow(worksheet)
      await this.addRowToWorkSheet(rows, worksheet)
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

  private paintIncidents(worksheet: ExcelJS.Worksheet, row: number, value: string) {
    let color = 'FFFFFFF'
    let fgColor = 'FFFFFFF'
    if (value === 'FAULT') {
      color = 'FFD45633'
      fgColor = 'FFFFFFF'
    } else if (value === 'ONTIME') {
      color = 'FF33D4AD'
    } else if (value === 'NEXT') {
      color = 'E4E4E4'
      fgColor = '000000'
    } else if (value === 'REST') {
      color = 'E4E4E4'
      fgColor = '000000'
    } else if (value === 'VACATIONS') {
      color = 'FFFFFFF'
      fgColor = '000000'
    } else if (value === 'HOLIDAY') {
      color = 'FFFFFFF'
      fgColor = '000000'
    } else if (value === 'DELAY') {
      color = 'FF993A'
    } else if (value === 'TOLERANCE') {
      color = '3CB4E5'
    }
    worksheet.getCell('O' + row).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }, // Color de fondo rojo
    }
    worksheet.getCell('O' + row).font = {
      color: { argb: fgColor }, // Color de fondo rojo
    }
  }

  private paintCheckOutStatus(worksheet: ExcelJS.Worksheet, row: number, value: string) {
    if (value.toString().toUpperCase() === 'DELAY') {
      const fgColor = 'FF993A'
      worksheet.getCell('N' + row).font = {
        color: { argb: fgColor },
      }
    }
  }

  private getRange(dateStart: string, dateEnd: string) {
    const dayStart = this.dateDay(dateStart)
    const monthStart = this.dateMonth(dateStart)
    const yearStart = this.dateYear(dateStart)
    const calendarDayStart = this.calendarDay(yearStart, monthStart, dayStart)
    const dayEnd = this.dateDay(dateEnd)
    const monthEnd = this.dateMonth(dateEnd)
    const yearEnd = this.dateYear(dateEnd)
    const calendarDayEnd = this.calendarDay(yearEnd, monthEnd, dayEnd)

    return `From ${calendarDayStart} to ${calendarDayEnd}`
  }

  private addRowExcelEmpty(rows: AssistExcelRowInterface[]) {
    rows.push({
      code: '',
      name: '',
      department: '',
      position: '',
      date: '',
      shiftAssigned: '',
      shiftStartDate: '',
      shiftEndsDate: '',
      checkInTime: '',
      firstCheck: '',
      lunchTime: '',
      returnLunchTime: '',
      checkOutTime: '',
      lastCheck: '',
      incidents: '',
      notes: '',
      sundayPremium: '',
      checkOutStatus: '',
      exceptions: [],
    })
  }

  private addRowExcelEmptyWithCode(rows: AssistExcelRowInterface[]) {
    rows.push({
      code: '0',
      name: '',
      department: '',
      position: '',
      date: '',
      shiftAssigned: '',
      shiftStartDate: '',
      shiftEndsDate: '',
      checkInTime: '',
      firstCheck: '',
      lunchTime: '',
      returnLunchTime: '',
      checkOutTime: '',
      lastCheck: '',
      incidents: '',
      notes: '',
      sundayPremium: '',
      checkOutStatus: '',
      exceptions: [],
    })
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

  private calendarDay(dateYear: number, dateMonth: number, dateDay: number) {
    const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
    const day = date.toFormat('DDD')
    return day
  }

  private calendarDayMonth(dateYear: number, dateMonth: number, dateDay: number) {
    const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
    const day = date.toFormat('dd/MMMM')
    return day
  }

  private chekInTime(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.checkIn?.assistPunchTimeOrigin) {
      return ''
    }

    const time = DateTime.fromISO(checkAssist.assist.checkIn.assistPunchTimeOrigin.toString(), {
      setZone: true,
    })
    const dateYear = checkAssist.day.split('-')[0].toString().padStart(2, '0')
    const dateMonth = checkAssist.day.split('-')[1].toString().padStart(2, '0')
    const dateDay = checkAssist.day.split('-')[2].toString().padStart(2, '0')
    const timeCST = time.setZone('UTC-5')
    const checkTimeTime = timeCST.toFormat('yyyy-LL-dd TT').split(' ')[1]
    const stringInDateString = `${dateYear}-${dateMonth}-${dateDay}T${checkTimeTime}.000-06:00`
    const timeCheckIn = DateTime.fromISO(stringInDateString, { setZone: true }).setZone(
      'America/Mexico_City'
    )
    return timeCheckIn.toFormat('ff')
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
    const dateYear = checkAssist.day.split('-')[0].toString().padStart(2, '0')
    const dateMonth = checkAssist.day.split('-')[1].toString().padStart(2, '0')
    const dateDay = checkAssist.day.split('-')[2].toString().padStart(2, '0')
    const timeCST = time.setZone('UTC-5')
    const checkTimeTime = timeCST.toFormat('yyyy-LL-dd TT').split(' ')[1]
    const stringInDateString = `${dateYear}-${dateMonth}-${dateDay}T${checkTimeTime}.000-06:00`
    const timeCheckOut = DateTime.fromISO(stringInDateString, { setZone: true }).setZone(
      'America/Mexico_City'
    )

    if (timeDate === now) {
      checkAssist.assist.checkOutStatus = ''
      return ''
    }

    return timeCheckOut.toFormat('ff')
  }

  addHeadRow(worksheet: ExcelJS.Worksheet) {
    const headerRow = worksheet.addRow([
      'Employee ID',
      'Employee Name',
      'Department',
      'Position',
      'Date',
      '',
      'Shift Assigned',
      'Shift Start Date',
      'Shift Ends Date',
      '',
      'Check-in',
      'Check go Eat',
      'Check back from Eat',
      'Check-out',
      'Status',
      'Exception Notes',
    ])
    let fgColor = 'FFFFFFF'
    let color = '538DD5'
    for (let col = 1; col <= 6; col++) {
      const cell = worksheet.getCell(4, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = '16365C'
    for (let col = 7; col <= 9; col++) {
      const cell = worksheet.getCell(4, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = '538DD5'
    for (let col = 10; col <= 16; col++) {
      const cell = worksheet.getCell(4, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    headerRow.height = 30
    headerRow.font = { bold: true, color: { argb: fgColor } }
    const columnA = worksheet.getColumn(1)
    columnA.width = 20
    columnA.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnB = worksheet.getColumn(2)
    columnB.width = 44
    columnB.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnC = worksheet.getColumn(3)
    columnC.width = 44
    columnC.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnD = worksheet.getColumn(4)
    columnD.width = 44
    columnD.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnE = worksheet.getColumn(5)
    columnE.width = 25
    columnE.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnF = worksheet.getColumn(6)
    columnF.width = 5
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
    columnJ.width = 5
    columnJ.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnK = worksheet.getColumn(11)
    columnK.width = 25
    columnK.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnL = worksheet.getColumn(12)
    columnL.width = 25
    columnL.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnM = worksheet.getColumn(13)
    columnM.width = 25
    columnM.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnN = worksheet.getColumn(14)
    columnN.width = 25
    columnN.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnO = worksheet.getColumn(15)
    columnO.width = 30
    columnO.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnP = worksheet.getColumn(16)
    columnP.width = 30
    columnP.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnQ = worksheet.getColumn(17)
    columnQ.width = 30
    columnQ.alignment = { vertical: 'middle', horizontal: 'center' }
  }

  async addRowCalendar(employee: Employee, employeeCalendar: AssistDayInterface[]) {
    const rows = [] as AssistExcelRowInterface[]
    for await (const calendar of employeeCalendar) {
      const exceptions = [] as ShiftExceptionInterface[]
      if (calendar.assist.exceptions.length > 0) {
        for await (const exception of calendar.assist.exceptions) {
          exceptions.push(exception)
        }
      }
      const day = this.dateDay(calendar.day)
      const month = this.dateMonth(calendar.day)
      const year = this.dateYear(calendar.day)
      const calendarDay = this.calendarDayMonth(year, month, day)
      const firstCheck = this.chekInTime(calendar)
      const lastCheck = this.chekOutTime(calendar)
      let status = calendar.assist.checkInStatus
        ? `${calendar.assist.checkInStatus}`.toUpperCase()
        : ''
      if (calendar.assist.isFutureDay) {
        status = 'NEXT'
      } else if (calendar.assist.isRestDay && !firstCheck) {
        status = 'REST'
      } else if (calendar.assist.isVacationDate) {
        status = 'VACATIONS'
      } else if (calendar.assist.isHoliday) {
        status = 'HOLIDAY'
      }
      let department = employee.department.departmentAlias
        ? employee.department.departmentAlias
        : ''
      department =
        department === '' && employee.department?.departmentName
          ? employee.department.departmentName
          : ''
      let position = employee.position.positionAlias ? employee.position.positionAlias : ''
      position =
        position === '' && employee.position?.positionName ? employee.position.positionName : ''
      let shiftName = ''
      let shiftStartDate = ''
      let shiftEndsDate = ''
      if (calendar && calendar.assist && calendar.assist.dateShift) {
        shiftName = calendar.assist.dateShift.shiftName
        shiftStartDate = calendar.assist.dateShift.shiftTimeStart
        const hoursToAddParsed = Number.parseFloat(
          calendar.assist.dateShift.shiftActiveHours.toString()
        )
        const time = DateTime.fromFormat(shiftStartDate, 'HH:mm:ss')
        const newTime = time.plus({ hours: hoursToAddParsed })
        shiftEndsDate = newTime.toFormat('HH:mm:ss')
      }
      rows.push({
        code: employee.employeeCode.toString(),
        name: `${employee.employeeFirstName} ${employee.employeeLastName}`,
        department: department,
        position: position,
        date: calendarDay,
        shiftAssigned: shiftName,
        shiftStartDate: shiftStartDate,
        shiftEndsDate: shiftEndsDate,
        checkInTime: calendar.assist.checkInDateTime
          ? DateTime.fromISO(calendar.assist.checkInDateTime.toString(), { setZone: true })
              .setZone('America/Mexico_City')
              .toFormat('ff')
          : '',
        firstCheck: firstCheck,
        lunchTime: calendar.assist.checkEatIn
          ? DateTime.fromISO(calendar.assist.checkEatIn.assistPunchTimeOrigin.toString(), {
              setZone: true,
            })
              .setZone('America/Mexico_City')
              .toFormat('ff')
          : '',
        returnLunchTime: calendar.assist.checkEatOut
          ? DateTime.fromISO(calendar.assist.checkEatOut.assistPunchTimeOrigin.toString(), {
              setZone: true,
            })
              .setZone('America/Mexico_City')
              .toFormat('ff')
          : '',
        checkOutTime: calendar.assist.checkOutDateTime
          ? DateTime.fromISO(calendar.assist.checkOutDateTime.toString(), { setZone: true })
              .setZone('America/Mexico_City')
              .toFormat('ff')
          : '',
        lastCheck: lastCheck,
        incidents: status,
        notes: '',
        sundayPremium: '',
        checkOutStatus: calendar.assist.checkOutStatus,
        exceptions: exceptions,
      })
    }
    return rows
  }

  async addExceptions(
    rowData: AssistExcelRowInterface,
    worksheet: ExcelJS.Worksheet,
    rowCount: number
  ) {
    const richText = []
    for await (const exception of rowData.exceptions) {
      const type = exception.exceptionType ? exception.exceptionType.exceptionTypeTypeName : ''
      const description = exception.shiftExceptionsDescription
        ? exception.shiftExceptionsDescription
        : ''
      richText.push(
        { text: type, font: { bold: true, size: 12, color: { argb: '000000' } } },
        { text: `\n${description}\n`, font: { italic: true, size: 10, color: { argb: '000000' } } }
      )
    }
    const cell = worksheet.getCell('N' + rowCount)
    cell.value = {
      richText: richText,
    }
    cell.alignment = { wrapText: true }
  }

  async addRowToWorkSheet(rows: AssistExcelRowInterface[], worksheet: ExcelJS.Worksheet) {
    let rowCount = 5
    let faultsTotal = 0
    for await (const rowData of rows) {
      if (rowData.incidents.toString().toUpperCase() === 'FAULT') {
        faultsTotal += 1
      }
      let incidents =
        !rowData.name && rowData.code !== '0'
          ? faultsTotal.toString().padStart(2, '0') + ' TOTAL FAULTS'
          : rowData.incidents
      worksheet.addRow([
        rowData.code !== '0' ? rowData.code : '',
        rowData.name,
        rowData.department,
        rowData.position,
        rowData.date,
        '',
        rowData.shiftAssigned,
        rowData.shiftStartDate,
        rowData.shiftEndsDate,
        '',
        rowData.checkInTime,
        rowData.lunchTime,
        rowData.returnLunchTime,
        rowData.checkOutTime,
        incidents,
        rowData.notes,
      ])
      if (rowData.name) {
        this.paintIncidents(worksheet, rowCount, rowData.incidents)
        this.paintCheckOutStatus(worksheet, rowCount, rowData.checkOutStatus)
      }
      if (rowData.exceptions.length > 0) {
        await this.addExceptions(rowData, worksheet, rowCount)
      }
      if (!rowData.name && rowData.code !== '0') {
        const color = 'FDE9D9'
        for (let col = 1; col <= 16; col++) {
          const cell = worksheet.getCell(rowCount, col)
          const row = worksheet.getRow(rowCount)
          row.height = 21
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          }
        }
        faultsTotal = 0
      }
      rowCount += 1
    }
  }
}
