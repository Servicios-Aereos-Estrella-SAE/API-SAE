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
import { AssistIncidentExcelRowInterface } from '../interfaces/assist_incident_excel_row_interface.js'
import Assist from '#models/assist'

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
      let worksheet = workbook.addWorksheet('Assistance Report')
      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0.28, row: 0.7 },
        ext: { width: 139, height: 49 },
      })
      worksheet.getRow(1).height = 60
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
      let periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
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
      // hasta aquí era lo de asistencia
      const rowsIncident = [] as AssistIncidentExcelRowInterface[]
      worksheet = workbook.addWorksheet('Incident Summary')
      const title = `Summary Report ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentToWorkSheet(workbook, worksheet, title)
      this.addHeadRowIncident(worksheet)
      const totalRowIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowIncident)
      const totalRowByDepartmentIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowByDepartmentIncident)
      if (data) {
        const employeeCalendar = data.employeeCalendar as AssistDayInterface[]
        let newRows = [] as AssistIncidentExcelRowInterface[]
        newRows = await this.addRowIncidentCalendar(employee, employeeCalendar)
        for await (const row of newRows) {
          rowsIncident.push(row)
          await this.addTotalByDepartment(totalRowByDepartmentIncident, row)
        }
      }
      await this.addTotalRow(totalRowIncident, totalRowByDepartmentIncident)
      await rowsIncident.push(totalRowByDepartmentIncident)
      await rowsIncident.push(totalRowIncident)
      await this.addRowIncidentToWorkSheet(rowsIncident, worksheet, 'employee')
      // hasta aquí era lo de asistencia
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
      let worksheet = workbook.addWorksheet('Assistance Report')
      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0.28, row: 0.7 },
        ext: { width: 139, height: 49 },
      })
      worksheet.getRow(1).height = 60
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
      // hasta aquí era lo de asistencia
      const rowsIncident = [] as AssistIncidentExcelRowInterface[]
      worksheet = workbook.addWorksheet('Incident Summary')
      const title = `Summary Report  ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentToWorkSheet(workbook, worksheet, title)
      this.addHeadRowIncident(worksheet)
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
          let newRows = [] as AssistIncidentExcelRowInterface[]
          newRows = await this.addRowIncidentCalendar(employee, employeeCalendar)
          for await (const row of newRows) {
            rowsIncident.push(row)
          }
          this.addRowIncidentExcelEmpty(rowsIncident)
          this.addRowIncidentExcelEmptyWithCode(rowsIncident)
        }
      }
      await this.addRowIncidentToWorkSheet(rowsIncident, worksheet, 'position')
      // hasta aquí era lo de asistencia
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
      let worksheet = workbook.addWorksheet('Assistance Report')
      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0.28, row: 0.7 },
        ext: { width: 139, height: 49 },
      })
      worksheet.getRow(1).height = 60
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
      // hasta aquí era lo de asistencia
      const rowsIncident = [] as AssistIncidentExcelRowInterface[]
      worksheet = workbook.addWorksheet('Incident Summary')
      const title = `Summary Report  ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentToWorkSheet(workbook, worksheet, title)
      this.addHeadRowIncident(worksheet)
      const totalRowIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowIncident)
      const totalRowByDepartmentIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowByDepartmentIncident)
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
            let newRows = [] as AssistIncidentExcelRowInterface[]
            newRows = await this.addRowIncidentCalendar(employee, employeeCalendar)
            for await (const row of newRows) {
              rowsIncident.push(row)
              await this.addTotalByDepartment(totalRowByDepartmentIncident, row)
            }
          }
        }
      }
      await this.addTotalRow(totalRowIncident, totalRowByDepartmentIncident)
      await rowsIncident.push(totalRowByDepartmentIncident)
      await rowsIncident.push(totalRowIncident)
      await this.addRowIncidentToWorkSheet(rowsIncident, worksheet, 'department')
      // hasta aquí era lo de asistencia
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
      let worksheet = workbook.addWorksheet('Assistance Report')
      const imageUrl =
        'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })
      worksheet.addImage(imageId, {
        tl: { col: 0.28, row: 0.7 },
        ext: { width: 139, height: 49 },
      })
      worksheet.getRow(1).height = 60
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
      // hasta aquí era lo de asistencia
      const rowsIncident = [] as AssistIncidentExcelRowInterface[]
      worksheet = workbook.addWorksheet('Incident Summary')
      const title = `Summary Report  ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentToWorkSheet(workbook, worksheet, title)
      this.addHeadRowIncident(worksheet)
      const totalRowIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowIncident)
      for await (const departmentRow of departments) {
        const totalRowByDepartmentIncident = {} as AssistIncidentExcelRowInterface
        await this.cleanTotalByDepartment(totalRowByDepartmentIncident)
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
              let newRows = [] as AssistIncidentExcelRowInterface[]
              newRows = await this.addRowIncidentCalendar(employee, employeeCalendar)
              for await (const row of newRows) {
                await this.addTotalByDepartment(totalRowByDepartmentIncident, row)
                rowsIncident.push(row)
              }
            }
          }
        }
        await rowsIncident.push(totalRowByDepartmentIncident)
        await this.addTotalRow(totalRowIncident, totalRowByDepartmentIncident)
      }
      await rowsIncident.push(totalRowIncident)
      await this.addRowIncidentToWorkSheet(rowsIncident, worksheet, 'all')
      // hasta aquí era lo de asistencia
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
      fgColor = 'FFFFFFF'
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
    } else if (value === 'EXCEPTION') {
      fgColor = '000000'
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
    return timeCheckIn.toFormat('MMM d, yyyy, h:mm:ss a')
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

    return timeCheckOut.toFormat('MMM d, yyyy, h:mm:ss a')
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
        checkInTime:
          calendar.assist.checkInDateTime && !calendar.assist.isFutureDay
            ? DateTime.fromISO(calendar.assist.checkInDateTime.toString(), { setZone: true })
                .setZone('America/Mexico_City')
                .toFormat('ff')
            : '',
        firstCheck: firstCheck,
        lunchTime: calendar.assist.checkEatIn
          ? DateTime.fromISO(calendar.assist.checkEatIn.assistPunchTimeOrigin.toString(), {
              setZone: true,
            })
              .setZone('UTC-5')
              .toFormat('MMM d, yyyy, h:mm:ss a')
          : '',
        returnLunchTime: calendar.assist.checkEatOut
          ? DateTime.fromISO(calendar.assist.checkEatOut.assistPunchTimeOrigin.toString(), {
              setZone: true,
            })
              .setZone('UTC-5')
              .toFormat('MMM d, yyyy, h:mm:ss a')
          : '',
        checkOutTime:
          calendar.assist.checkOutDateTime && !calendar.assist.isFutureDay
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
    const cell = worksheet.getCell('P' + rowCount)
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
        rowData.firstCheck,
        rowData.lunchTime,
        rowData.returnLunchTime,
        rowData.lastCheck,
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

  addHeadRowIncident(worksheet: ExcelJS.Worksheet) {
    const headerRow = worksheet.addRow([
      'Department',
      'Employee ID',
      'Employee Name',
      'Days Worked',
      'On Time',
      'Tolerances',
      'Delays',
      'Rests',
      'Sunday Bonus',
      'Vacations',
      'Exceptions',
      'Holidays Worked',
      'Faults',
      'Delays Faults',
      'Total Faults',
    ])
    let fgColor = 'FFFFFFF'
    let color = '30869C'
    for (let col = 1; col <= 15; col++) {
      const cell = worksheet.getCell(3, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    headerRow.height = 30
    headerRow.font = { bold: true, color: { argb: fgColor } }
    const columnA = worksheet.getColumn(1)
    columnA.width = 23
    columnA.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnB = worksheet.getColumn(2)
    columnB.width = 16
    columnB.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnC = worksheet.getColumn(3)
    columnC.width = 32
    columnC.alignment = { vertical: 'middle', horizontal: 'left' }
    const columnD = worksheet.getColumn(4)
    columnD.width = 16
    columnD.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnE = worksheet.getColumn(5)
    columnE.width = 16
    columnE.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnF = worksheet.getColumn(6)
    columnF.width = 16
    columnF.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnG = worksheet.getColumn(7)
    columnG.width = 16
    columnG.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnH = worksheet.getColumn(8)
    columnH.width = 16
    columnH.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnI = worksheet.getColumn(9)
    columnI.width = 16
    columnI.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnJ = worksheet.getColumn(10)
    columnJ.width = 16
    columnJ.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnK = worksheet.getColumn(11)
    columnK.width = 16
    columnK.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnL = worksheet.getColumn(12)
    columnL.width = 16
    columnL.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnM = worksheet.getColumn(13)
    columnM.width = 16
    columnM.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnN = worksheet.getColumn(14)
    columnN.width = 16
    columnN.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnO = worksheet.getColumn(15)
    columnO.width = 16
    columnO.alignment = { vertical: 'middle', horizontal: 'center' }
  }

  async addRowIncidentCalendar(employee: Employee, employeeCalendar: AssistDayInterface[]) {
    const rows = [] as AssistIncidentExcelRowInterface[]
    let department = employee.department.departmentAlias ? employee.department.departmentAlias : ''
    department =
      department === '' && employee.department?.departmentName
        ? employee.department.departmentName
        : ''
    let daysWorked = 0
    let daysOnTime = 0
    let tolerances = 0
    let delays = 0
    let rests = 0
    let sundayBonus = 0
    let vacations = 0
    let holidaysWorked = 0
    let faults = 0
    let delayFaults = 0
    const exceptions = [] as ShiftExceptionInterface[]
    for await (const calendar of employeeCalendar) {
      if (!calendar.assist.isFutureDay) {
        if (calendar.assist.exceptions.length > 0) {
          for await (const exception of calendar.assist.exceptions) {
            if (exception.exceptionType) {
              const exceptionTypeSlug = exception.exceptionType.exceptionTypeSlug
              if (exceptionTypeSlug !== 'rest-day' && exceptionTypeSlug !== 'vacation') {
                exceptions.push(exception)
              }
            }
          }
        }
        const firstCheck = this.chekInTime(calendar)
        if (calendar.assist.dateShift) {
          daysWorked += 1
          if (calendar.assist.checkInStatus !== 'fault') {
            if (calendar.assist.checkInStatus === 'ontime') {
              daysOnTime += 1
            } else if (calendar.assist.checkInStatus === 'tolerance') {
              tolerances += 1
            } else if (calendar.assist.checkInStatus === 'delay') {
              delays += 1
            }
          }
          if (
            calendar.assist.isSundayBonus &&
            (calendar.assist.checkIn || calendar.assist.checkOut)
          ) {
            sundayBonus += 1
          }
          if (calendar.assist.isRestDay && !firstCheck) {
            rests += 1
          }
          if (calendar.assist.isVacationDate) {
            vacations += 1
          }
          if (calendar.assist.checkInStatus === 'fault' && !calendar.assist.isRestDay) {
            faults += 1
          }
        }
        if (calendar.assist.isHoliday && calendar.assist.checkIn) {
          holidaysWorked += 1
        }
      }
    }
    delayFaults = this.getFaultsFromDelays(delays)
    rows.push({
      employeeId: employee.employeeCode.toString(),
      employeeName: `${employee.employeeFirstName} ${employee.employeeLastName}`,
      department: department,
      daysWorked: daysWorked,
      daysOnTime: daysOnTime,
      tolerances: tolerances,
      delays: delays,
      rests: rests,
      sundayBonus: sundayBonus,
      vacations: vacations,
      exeptions: exceptions.length,
      holidaysWorked: holidaysWorked,
      faults: faults,
      delayFaults: delayFaults,
      totalFaults: faults + delayFaults,
    })
    return rows
  }

  private addRowIncidentExcelEmpty(rows: AssistIncidentExcelRowInterface[]) {
    rows.push({
      employeeId: '',
      employeeName: '',
      department: '',
      daysWorked: 0,
      daysOnTime: 0,
      tolerances: 0,
      delays: 0,
      rests: 0,
      sundayBonus: 0,
      vacations: 0,
      exeptions: 0,
      holidaysWorked: 0,
      faults: 0,
      delayFaults: 0,
      totalFaults: 0,
    })
  }

  private addRowIncidentExcelEmptyWithCode(rows: AssistIncidentExcelRowInterface[]) {
    rows.push({
      employeeId: '0',
      employeeName: '',
      department: '',
      daysWorked: 0,
      daysOnTime: 0,
      tolerances: 0,
      delays: 0,
      rests: 0,
      sundayBonus: 0,
      vacations: 0,
      exeptions: 0,
      holidaysWorked: 0,
      faults: 0,
      delayFaults: 0,
      totalFaults: 0,
    })
  }

  async addRowIncidentToWorkSheet(
    rows: AssistIncidentExcelRowInterface[],
    worksheet: ExcelJS.Worksheet,
    type: string
  ) {
    let rowCount = 5
    let currentDepartment = ''
    let currentDepartmentRow = 5
    for await (const rowData of rows) {
      if (rowData.employeeName !== 'null') {
        if (currentDepartment !== rowData.department && rowData.department) {
          if (currentDepartment !== '') {
            worksheet.mergeCells(`A${currentDepartmentRow}:A${rowCount - 3}`)
            for (let rowCurrent = currentDepartmentRow; rowCurrent < rowCount - 2; rowCurrent++) {
              const cell = worksheet.getCell(rowCurrent, 1)
              const color = '93CDDC'
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: color },
              }
              cell.font = { color: { argb: 'FFFFFF' } }
            }
            if (type === 'all') {
              worksheet.addRow([])
              rowCount += 1
            }
          }
          currentDepartment = rowData.department
          currentDepartmentRow = rowCount - 1
        }
        if (rowData.department === 'TOTALS') {
          worksheet.addRow([])
          rowCount += 1
        }
        worksheet.addRow([
          rowData.department,
          rowData.employeeId,
          rowData.employeeName,
          rowData.daysWorked,
          rowData.daysOnTime,
          rowData.tolerances,
          rowData.delays,
          rowData.rests,
          rowData.sundayBonus,
          rowData.vacations,
          rowData.exeptions,
          rowData.holidaysWorked,
          rowData.faults,
          rowData.delayFaults,
          rowData.totalFaults,
        ])
        if (!rowData.employeeName && rowData.employeeId === '') {
          const color = '93CDDC'
          for (let col = 1; col <= 15; col++) {
            const cell = worksheet.getCell(rowCount - 1, col)
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            }
            cell.font = { color: { argb: 'FFFFFF' } }
          }
        }
        if (rowData.department === 'TOTALS') {
          const color = '30869C'
          for (let col = 1; col <= 15; col++) {
            const cell = worksheet.getCell(rowCount - 1, col)
            const row = worksheet.getRow(rowCount - 1)
            row.height = 30
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            }
            cell.font = { color: { argb: 'FFFFFF' } }
          }
        }
        rowCount += 1
      }
    }
  }

  async addTitleIncidentToWorkSheet(
    workbook: ExcelJS.Workbook,
    worksheet: ExcelJS.Worksheet,
    title: string
  ) {
    const imageUrl = 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.png'
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const imageBuffer = imageResponse.data
    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: 'png',
    })
    // Agregar la imagen y centrarla en la celda
    worksheet.addImage(imageId, {
      tl: { col: 0.28, row: 0.7 },
      ext: { width: 139, height: 49 }, // Tamaño de la imagen
    })
    worksheet.getRow(1).height = 60
    const fgColor = '000000'
    worksheet.getCell('B1').value = title
    worksheet.getCell('B1').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.mergeCells('B1:O1')
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }, // Fija la primera fila
      { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
      { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
    ]
    worksheet.addRow([])
  }

  addTotalByDepartment(
    totalRowIncident: AssistIncidentExcelRowInterface,
    row: AssistIncidentExcelRowInterface
  ) {
    totalRowIncident.employeeId = ''
    totalRowIncident.employeeName = ''
    totalRowIncident.daysOnTime += row.daysOnTime
    totalRowIncident.tolerances += row.tolerances
    totalRowIncident.delays += row.delays
    totalRowIncident.rests += row.rests
    totalRowIncident.sundayBonus += row.sundayBonus
    totalRowIncident.vacations += row.vacations
    totalRowIncident.exeptions += row.exeptions
    totalRowIncident.holidaysWorked += row.holidaysWorked
    totalRowIncident.faults += row.faults
    totalRowIncident.delayFaults += row.delayFaults
    totalRowIncident.totalFaults += row.totalFaults
  }

  addTotalRow(
    totalRowIncident: AssistIncidentExcelRowInterface,
    rowByDepartment: AssistIncidentExcelRowInterface
  ) {
    totalRowIncident.employeeId = ''
    totalRowIncident.employeeName = ''
    totalRowIncident.department = 'TOTALS'
    totalRowIncident.daysOnTime += rowByDepartment.daysOnTime
    totalRowIncident.tolerances += rowByDepartment.tolerances
    totalRowIncident.delays += rowByDepartment.delays
    totalRowIncident.rests += rowByDepartment.rests
    totalRowIncident.sundayBonus += rowByDepartment.sundayBonus
    totalRowIncident.vacations += rowByDepartment.vacations
    totalRowIncident.exeptions += rowByDepartment.exeptions
    totalRowIncident.holidaysWorked += rowByDepartment.holidaysWorked
    totalRowIncident.faults += rowByDepartment.faults
    totalRowIncident.delayFaults += rowByDepartment.delayFaults
    totalRowIncident.totalFaults += rowByDepartment.totalFaults
  }

  cleanTotalByDepartment(totalRowIncident: AssistIncidentExcelRowInterface) {
    totalRowIncident.employeeId = ''
    totalRowIncident.employeeName = 'null'
    totalRowIncident.daysOnTime = 0
    totalRowIncident.tolerances = 0
    totalRowIncident.delays = 0
    totalRowIncident.rests = 0
    totalRowIncident.sundayBonus = 0
    totalRowIncident.vacations = 0
    totalRowIncident.exeptions = 0
    totalRowIncident.holidaysWorked = 0
    totalRowIncident.faults = 0
    totalRowIncident.delayFaults = 0
    totalRowIncident.totalFaults = 0
  }

  getFaultsFromDelays(delays: number) {
    const faults = Math.floor(delays / 3) // Cada 3 retardos es 1 falta
    return faults
  }

  async store(assist: Assist) {
    const newAssist = new Assist()
    newAssist.assistEmpCode = assist.assistEmpCode
    newAssist.assistTerminalSn = assist.assistTerminalSn
    newAssist.assistTerminalAlias = assist.assistTerminalAlias
    newAssist.assistAreaAlias = assist.assistAreaAlias
    newAssist.assistLongitude = assist.assistLongitude
    newAssist.assistLatitude = assist.assistLatitude
    newAssist.assistUploadTime = assist.assistUploadTime
    newAssist.assistEmpId = assist.assistEmpId
    newAssist.assistTerminalId = assist.assistTerminalId
    newAssist.assistSyncId = assist.assistSyncId
    newAssist.assistPunchTime = assist.assistPunchTime
    newAssist.assistPunchTimeUtc = assist.assistPunchTimeUtc
    newAssist.assistPunchTimeOrigin = assist.assistPunchTimeOrigin
    await newAssist.save()
    return newAssist
  }

  async verifyInfo(assist: Assist) {
    const action = 'created'
    const punchTime = DateTime.fromJSDate(new Date(assist.assistPunchTime.toString()))
    const sqlPunchTime = punchTime.isValid ? punchTime.toSQL() : null
    if (!sqlPunchTime) {
      return {
        status: 400,
        type: 'warning',
        title: 'The assistPunchTime is not valid',
        message: `The assist resource cannot be ${action} because the assistPunchTime is not valid `,
        data: { ...assist },
      }
    }
    if (punchTime) {
      const existDate = await Assist.query()
        .where('assist_emp_id', assist.assistEmpId)
        .whereNull('assist_deleted_at')
        .where('assist_punch_time', sqlPunchTime)
        .first()

      if (existDate) {
        return {
          status: 400,
          type: 'warning',
          title: 'The assistPunchTime already exists for another assist',
          message: `The assist resource cannot be ${action} because the assistPunchTime is already assigned to another assist`,
          data: { ...assist },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...assist },
    }
  }
}
