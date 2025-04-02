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
import Tolerance from '#models/tolerance'
import { LogStore } from '#models/MongoDB/log_store'
import { LogAssist } from '../interfaces/MongoDB/log_assist.js'
import BusinessUnit from '#models/business_unit'
import env from '#start/env'
import SystemSettingService from './system_setting_service.js'
import SystemSetting from '#models/system_setting'
import { AssistIncidentPayrollExcelRowInterface } from '../interfaces/assist_incident_payroll_excel_row_interface.js'
import sharp from 'sharp'
import { AssistExcelImageInterface } from '../interfaces/assist_excel_image_interface.js'

export default class AssistsService {
  async getExcelByEmployeeAssistance(
    employee: Employee,
    filters: AssistEmployeeExcelFilterInterface
  ) {
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
      }
      const workbook = new ExcelJS.Workbook()
      let worksheet = workbook.addWorksheet('Assistance Report')
      const assistExcelImageInterface = {
        workbook: workbook,
        worksheet: worksheet,
        col: 0.28,
        row: 0.7,
      } as AssistExcelImageInterface
      await this.addImageLogo(assistExcelImageInterface)
      worksheet.getRow(1).height = 60
      worksheet.mergeCells('A1:Q1')
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
      worksheet.mergeCells('A2:Q2')
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
      worksheet.mergeCells('A3:Q3')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
        { state: 'frozen', ySplit: 4 }, // Fija la cuarta fila
      ]
      this.addHeadRow(worksheet)
      const status = employee.deletedAt ? 'Terminated' : 'Active'
      await this.addRowToWorkSheet(rows, worksheet, status)
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

  async getExcelByEmployeeIncidentSummary(
    employee: Employee,
    filters: AssistEmployeeExcelFilterInterface
  ) {
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
      }
      const workbook = new ExcelJS.Workbook()
      const rowsIncident = [] as AssistIncidentExcelRowInterface[]
      const worksheet = workbook.addWorksheet('Incident Summary')
      const title = `Summary Report ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentToWorkSheet(workbook, worksheet, title)
      this.addHeadRowIncident(worksheet)
      const totalRowIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowIncident)
      const totalRowByDepartmentIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowByDepartmentIncident)
      const tardies = await this.getTardiesTolerance()
      if (data) {
        const employeeCalendar = data.employeeCalendar as AssistDayInterface[]
        let newRows = [] as AssistIncidentExcelRowInterface[]
        newRows = await this.addRowIncidentCalendar(employee, employeeCalendar, tardies)
        for await (const row of newRows) {
          rowsIncident.push(row)
          await this.addTotalByDepartment(totalRowByDepartmentIncident, row)
        }
      }
      await this.addTotalRow(totalRowIncident, totalRowByDepartmentIncident)
      await rowsIncident.push(totalRowByDepartmentIncident)
      await rowsIncident.push(totalRowIncident)
      await this.addRowIncidentToWorkSheet(rowsIncident, worksheet)
      if (employee.deletedAt) {
        await this.paintEmployeeTerminated(worksheet, 'C', 4)
      }
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

  async getExcelByEmployeeIncidentSummaryPayroll(
    employee: Employee,
    filters: AssistEmployeeExcelFilterInterface
  ) {
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
      const tardies = await this.getTardiesTolerance()
      if (data) {
        const employeeCalendar = data.employeeCalendar as AssistDayInterface[]
        let newRows = [] as AssistExcelRowInterface[]
        newRows = await this.addRowCalendar(employee, employeeCalendar)
        for await (const row of newRows) {
          rows.push(row)
        }
      }
      const workbook = new ExcelJS.Workbook()
      const rowsIncidentPayroll = [] as AssistIncidentPayrollExcelRowInterface[]
      const tradeName = await this.getTradeName()
      const worksheet = workbook.addWorksheet('Incident Summary Payroll')
      const titlePayroll = `Incidencias ${tradeName} ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentPayrollToWorkSheet(workbook, worksheet, titlePayroll)
      await this.addHeadRowIncidentPayroll(worksheet)

      if (data) {
        const employeeCalendar = data.employeeCalendar as AssistDayInterface[]
        let newRows = [] as AssistIncidentPayrollExcelRowInterface[]
        newRows = await this.addRowIncidentPayrollCalendar(
          employee,
          employeeCalendar,
          tardies,
          filters.filterDatePay
        )
        for await (const row of newRows) {
          rowsIncidentPayroll.push(row)
        }
      }
      await this.addRowIncidentPayrollToWorkSheet(rowsIncidentPayroll, worksheet)
      await this.paintBorderAll(worksheet, rowsIncidentPayroll.length)
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
          ignoreDiscriminated: 0,
          ignoreExternal: 1,
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
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      let worksheet = workbook.addWorksheet('Assistance Report')
      const assistExcelImageInterface = {
        workbook: workbook,
        worksheet: worksheet,
        col: 0.28,
        row: 0.7,
      } as AssistExcelImageInterface
      await this.addImageLogo(assistExcelImageInterface)
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
      const tardies = await this.getTardiesTolerance()
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
          newRows = await this.addRowIncidentCalendar(employee, employeeCalendar, tardies)
          for await (const row of newRows) {
            rowsIncident.push(row)
          }
          this.addRowIncidentExcelEmpty(rowsIncident)
          this.addRowIncidentExcelEmptyWithCode(rowsIncident)
        }
      }
      await this.addRowIncidentToWorkSheet(rowsIncident, worksheet)
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

  async getExcelByDepartmentAssistance(filters: AssistDepartmentExcelFilterInterface) {
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
            ignoreDiscriminated: 0,
            ignoreExternal: 1,
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
          }
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      let worksheet = workbook.addWorksheet('Assistance Report')
      const assistExcelImageInterface = {
        workbook: workbook,
        worksheet: worksheet,
        col: 0.28,
        row: 0.7,
      } as AssistExcelImageInterface
      await this.addImageLogo(assistExcelImageInterface)
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

  async getExcelByDepartmentIncidentSummary(filters: AssistDepartmentExcelFilterInterface) {
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
            ignoreDiscriminated: 0,
            ignoreExternal: 1,
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
          }
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const rowsIncident = [] as AssistIncidentExcelRowInterface[]
      const worksheet = workbook.addWorksheet('Incident Summary')
      const title = `Summary Report  ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentToWorkSheet(workbook, worksheet, title)
      this.addHeadRowIncident(worksheet)
      const totalRowIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowIncident)
      const totalRowByDepartmentIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowByDepartmentIncident)
      const tardies = await this.getTardiesTolerance()
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
            ignoreDiscriminated: 0,
            ignoreExternal: 1,
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
            newRows = await this.addRowIncidentCalendar(employee, employeeCalendar, tardies)
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
      await this.addRowIncidentToWorkSheet(rowsIncident, worksheet)
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

  async getExcelByDepartmentIncidentSummaryPayRoll(filters: AssistDepartmentExcelFilterInterface) {
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
            ignoreDiscriminated: 0,
            ignoreExternal: 1,
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
          }
        }
      }
      const workbook = new ExcelJS.Workbook()
      const rowsIncidentPayroll = [] as AssistIncidentPayrollExcelRowInterface[]
      const tradeName = await this.getTradeName()
      const worksheet = workbook.addWorksheet('Incident Summary Payroll')
      const titlePayroll = `Incidencias ${tradeName} ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentPayrollToWorkSheet(workbook, worksheet, titlePayroll)
      this.addHeadRowIncidentPayroll(worksheet)
      const tardies = await this.getTardiesTolerance()
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
            ignoreDiscriminated: 0,
            ignoreExternal: 1,
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
            let newRows = [] as AssistIncidentPayrollExcelRowInterface[]
            newRows = await this.addRowIncidentPayrollCalendar(
              employee,
              employeeCalendar,
              tardies,
              filters.filterDatePay
            )
            for await (const row of newRows) {
              rowsIncidentPayroll.push(row)
            }
          }
        }
      }
      await this.addRowIncidentPayrollToWorkSheet(rowsIncidentPayroll, worksheet)
      await this.paintBorderAll(worksheet, rowsIncidentPayroll.length)
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

  async getExcelAllAssistance(filters: AssistExcelFilterInterface, departmentsList: Array<number>) {
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
              ignoreDiscriminated: 0,
              ignoreExternal: 1,
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
            }
          }
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      let worksheet = workbook.addWorksheet('Assistance Report')
      const assistExcelImageInterface = {
        workbook: workbook,
        worksheet: worksheet,
        col: 0.28,
        row: 0.7,
      } as AssistExcelImageInterface
      await this.addImageLogo(assistExcelImageInterface)
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

  async getExcelAllIncidentSummary(
    filters: AssistExcelFilterInterface,
    departmentsList: Array<number>
  ) {
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
              ignoreDiscriminated: 0,
              ignoreExternal: 1,
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
            }
          }
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      // hasta aquí era lo de asistencia
      const rowsIncident = [] as AssistIncidentExcelRowInterface[]
      const worksheet = workbook.addWorksheet('Incident Summary')
      const title = `Summary Report  ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentToWorkSheet(workbook, worksheet, title)
      this.addHeadRowIncident(worksheet)
      const totalRowIncident = {} as AssistIncidentExcelRowInterface
      await this.cleanTotalByDepartment(totalRowIncident)
      const tardies = await this.getTardiesTolerance()
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
              ignoreDiscriminated: 0,
              ignoreExternal: 1,
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
              newRows = await this.addRowIncidentCalendar(employee, employeeCalendar, tardies)
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
      await this.addRowIncidentToWorkSheet(rowsIncident, worksheet)
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

  async getExcelAllIncidentSummaryPayRoll(
    filters: AssistDepartmentExcelFilterInterface,
    departmentsList: Array<number>
  ) {
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
      const tardies = await this.getTardiesTolerance()
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
              ignoreDiscriminated: 0,
              ignoreExternal: 1,
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
            }
          }
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      // hasta aquí era lo de incidencias
      const rowsIncidentPayroll = [] as AssistIncidentPayrollExcelRowInterface[]
      const tradeName = await this.getTradeName()
      const worksheet = workbook.addWorksheet('Incident Summary Payroll')
      const titlePayroll = `Incidencias ${tradeName} ${this.getRange(filterDate, filterDateEnd)}`
      await this.addTitleIncidentPayrollToWorkSheet(workbook, worksheet, titlePayroll)
      this.addHeadRowIncidentPayroll(worksheet)
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
              ignoreDiscriminated: 0,
              ignoreExternal: 1,
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
              let newRows = [] as AssistIncidentPayrollExcelRowInterface[]
              newRows = await this.addRowIncidentPayrollCalendar(
                employee,
                employeeCalendar,
                tardies,
                filters.filterDatePay
              )
              for await (const row of newRows) {
                rowsIncidentPayroll.push(row)
              }
            }
          }
        }
      }
      await this.addRowIncidentPayrollToWorkSheet(rowsIncidentPayroll, worksheet)
      await this.paintBorderAll(worksheet, rowsIncidentPayroll.length)
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
    worksheet.getCell('P' + row).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }, // Color de fondo rojo
    }
    worksheet.getCell('P' + row).font = {
      color: { argb: fgColor }, // Color de fondo rojo
    }
  }

  private paintEmployeeTerminated(worksheet: ExcelJS.Worksheet, columnName: string, row: number) {
    const color = 'FFD45633'
    const fgColor = 'FFFFFFF'
    worksheet.getCell(columnName + row).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }, // Color de fondo rojo
    }
    worksheet.getCell(columnName + row).font = {
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
    const timeCheckIn = DateTime.fromISO(
      checkAssist.assist.checkIn.assistPunchTimeOrigin.toString(),
      { setZone: true }
    ).setZone('America/Mexico_City')
    return timeCheckIn.toFormat('MMM d, yyyy, h:mm:ss a')
  }

  private chekOutTime(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.checkOut?.assistPunchTimeOrigin) {
      return ''
    }

    const now = DateTime.now().toFormat('yyyy-LL-dd')
    const timeCheckOut = DateTime.fromISO(
      checkAssist.assist.checkOut.assistPunchTimeOrigin.toString(),
      { setZone: true }
    ).setZone('America/Mexico_City')
    if (timeCheckOut.toFormat('yyyy-LL-dd') === now) {
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
      'Hours worked',
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
    for (let col = 10; col <= 17; col++) {
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
    columnO.width = 25
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
      if (!calendar.assist.dateShift) {
        status = ''
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
      let hoursWorked = 0
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

      const checkInTime = calendar.assist.checkIn?.assistPunchTimeUtc
      const checkOutTime = calendar.assist.checkOut?.assistPunchTimeUtc

      const firstCheckTime = checkInTime
        ? DateTime.fromISO(checkInTime instanceof Date ? checkInTime.toISOString() : checkInTime, {
            zone: 'America/Mexico_City',
          })
        : null
      const lastCheckTime = checkOutTime
        ? DateTime.fromISO(
            checkOutTime instanceof Date ? checkOutTime.toISOString() : checkOutTime,
            {
              zone: 'America/Mexico_City',
            }
          )
        : null

      if (firstCheckTime && lastCheckTime && firstCheckTime.isValid && lastCheckTime.isValid) {
        const durationInMinutes = lastCheckTime.diff(firstCheckTime, 'minutes').as('minutes')
        let hours = Math.floor(durationInMinutes / 60)
        let minutes = Math.round(durationInMinutes % 60)
        if (minutes >= 60) {
          hours += Math.floor(minutes / 60)
          minutes = minutes % 60
        }
        const timeInDecimal = hours + minutes / 60
        hoursWorked += timeInDecimal
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
              .setZone('America/Mexico_city')
              .toFormat('MMM d, yyyy, h:mm:ss a')
          : '',
        returnLunchTime: calendar.assist.checkEatOut
          ? DateTime.fromISO(calendar.assist.checkEatOut.assistPunchTimeOrigin.toString(), {
              setZone: true,
            })
              .setZone('America/Mexico_city')
              .toFormat('MMM d, yyyy, h:mm:ss a')
          : '',
        checkOutTime:
          calendar.assist.checkOutDateTime && !calendar.assist.isFutureDay
            ? DateTime.fromISO(calendar.assist.checkOutDateTime.toString(), { setZone: true })
                .setZone('America/Mexico_City')
                .toFormat('ff')
            : '',
        lastCheck: lastCheck,
        hoursWorked: hoursWorked,
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
    const cell = worksheet.getCell('Q' + rowCount)
    cell.value = {
      richText: richText,
    }
    cell.alignment = { wrapText: true }
  }

  async addRowToWorkSheet(
    rows: AssistExcelRowInterface[],
    worksheet: ExcelJS.Worksheet,
    status: string = 'Active'
  ) {
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
        this.decimalToTimeString(rowData.hoursWorked),
        incidents,
        rowData.notes,
      ])
      if (rowData.name) {
        this.paintIncidents(worksheet, rowCount, rowData.incidents)
        this.paintCheckOutStatus(worksheet, rowCount, rowData.checkOutStatus)
        if (status === 'Terminated') {
          await this.paintEmployeeTerminated(worksheet, 'B', rowCount)
        }
      }
      if (rowData.exceptions.length > 0) {
        await this.addExceptions(rowData, worksheet, rowCount)
      }
      if (!rowData.name && rowData.code !== '0') {
        const color = 'FDE9D9'
        for (let col = 1; col <= 17; col++) {
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
      'Early Outs',
      'Rests',
      'Sunday Bonus',
      'Vacations',
      'Exceptions',
      'Holidays Worked',
      'Rest Worked',
      'Faults',
      'Delays Faults',
      'Early Outs Faults',
      'Total Faults',
      'Total Hours Worked',
    ])
    let fgColor = 'FFFFFFF'
    let color = '30869C'
    for (let col = 1; col <= 19; col++) {
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
    const columnP = worksheet.getColumn(16)
    columnP.width = 16
    columnP.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnQ = worksheet.getColumn(17)
    columnQ.width = 16
    columnQ.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnR = worksheet.getColumn(18)
    columnR.width = 16
    columnR.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnS = worksheet.getColumn(19)
    columnS.width = 16
    columnS.alignment = { vertical: 'middle', horizontal: 'center' }
  }

  async addRowIncidentCalendar(
    employee: Employee,
    employeeCalendar: AssistDayInterface[],
    tardies: number
  ) {
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
    let earlyOuts = 0
    let rests = 0
    let sundayBonus = 0
    let vacations = 0
    let holidaysWorked = 0
    let restWorked = 0
    let faults = 0
    let delayFaults = 0
    let earlyOutsFaults = 0
    let hoursWorked = 0
    const exceptions = [] as ShiftExceptionInterface[]
    for await (const calendar of employeeCalendar) {
      if (!calendar.assist.isFutureDay) {
        let laborRestCounted = false
        if (calendar.assist.exceptions.length > 0) {
          for await (const exception of calendar.assist.exceptions) {
            if (exception.exceptionType) {
              const exceptionTypeSlug = exception.exceptionType.exceptionTypeSlug
              if (exceptionTypeSlug !== 'rest-day' && exceptionTypeSlug !== 'vacation') {
                exceptions.push(exception)
              }
              if (exceptionTypeSlug === 'descanso-laborado') {
                if (
                  exception.shiftExceptionEnjoymentOfSalary &&
                  exception.shiftExceptionEnjoymentOfSalary === 1 &&
                  calendar.assist.checkIn
                ) {
                  restWorked += 1
                  laborRestCounted = true
                }
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
          if (calendar.assist.checkOutStatus !== 'fault') {
            if (calendar.assist.checkOutStatus === 'delay') {
              earlyOuts += 1
            }
          }
          if (
            calendar.assist.isSundayBonus &&
            (calendar.assist.checkIn ||
              calendar.assist.checkOut ||
              (calendar.assist.assitFlatList && calendar.assist.assitFlatList.length > 0))
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
          if (!laborRestCounted) {
            restWorked += 1
          }
        }
        const checkInTime = calendar.assist.checkIn?.assistPunchTimeUtc
        const checkOutTime = calendar.assist.checkOut?.assistPunchTimeUtc

        const firstCheckTime = checkInTime
          ? DateTime.fromISO(
              checkInTime instanceof Date ? checkInTime.toISOString() : checkInTime,
              {
                zone: 'America/Mexico_City',
              }
            )
          : null
        const lastCheckTime = checkOutTime
          ? DateTime.fromISO(
              checkOutTime instanceof Date ? checkOutTime.toISOString() : checkOutTime,
              {
                zone: 'America/Mexico_City',
              }
            )
          : null

        if (firstCheckTime && lastCheckTime && firstCheckTime.isValid && lastCheckTime.isValid) {
          const duration = lastCheckTime.diff(firstCheckTime, 'minutes')
          const hours = Math.floor(duration.as('minutes') / 60)
          const minutes = duration.as('minutes') % 60
          hoursWorked += hours + minutes / 60
        }
      }
    }

    delayFaults = this.getFaultsFromDelays(delays, tardies)
    earlyOutsFaults = this.getFaultsFromDelays(earlyOuts, tardies)
    rows.push({
      employeeId: employee.employeeCode.toString(),
      employeeName: `${employee.employeeFirstName} ${employee.employeeLastName}`,
      department: department,
      daysWorked: daysWorked,
      daysOnTime: daysOnTime,
      tolerances: tolerances,
      delays: delays,
      earlyOuts: earlyOuts,
      rests: rests,
      sundayBonus: sundayBonus,
      vacations: vacations,
      exeptions: exceptions.length,
      holidaysWorked: holidaysWorked,
      restWorked: restWorked,
      faults: faults,
      delayFaults: delayFaults,
      earlyOutsFaults: earlyOutsFaults,
      totalFaults: faults + delayFaults + earlyOutsFaults,
      hoursWorked: hoursWorked,
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
      earlyOuts: 0,
      rests: 0,
      sundayBonus: 0,
      vacations: 0,
      exeptions: 0,
      holidaysWorked: 0,
      restWorked: 0,
      faults: 0,
      delayFaults: 0,
      earlyOutsFaults: 0,
      totalFaults: 0,
      hoursWorked: 0,
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
      earlyOuts: 0,
      rests: 0,
      sundayBonus: 0,
      vacations: 0,
      exeptions: 0,
      holidaysWorked: 0,
      restWorked: 0,
      faults: 0,
      delayFaults: 0,
      earlyOutsFaults: 0,
      totalFaults: 0,
      hoursWorked: 0,
    })
  }

  async addRowIncidentToWorkSheet(
    rows: AssistIncidentExcelRowInterface[],
    worksheet: ExcelJS.Worksheet
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
          }
          currentDepartment = rowData.department
          currentDepartmentRow = rowCount - 1
        }
        worksheet.addRow([
          rowData.department,
          rowData.employeeId,
          rowData.employeeName,
          rowData.daysWorked,
          rowData.daysOnTime,
          rowData.tolerances,
          rowData.delays,
          rowData.earlyOuts,
          rowData.rests,
          rowData.sundayBonus,
          rowData.vacations,
          rowData.exeptions,
          rowData.holidaysWorked,
          rowData.restWorked,
          rowData.faults,
          rowData.delayFaults,
          rowData.earlyOutsFaults,
          rowData.totalFaults,
          this.decimalToTimeString(rowData.hoursWorked),
        ])
        if (!rowData.employeeName && rowData.employeeId === '') {
          const color = '93CDDC'
          for (let col = 1; col <= 19; col++) {
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
          for (let col = 1; col <= 19; col++) {
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
    const assistExcelImageInterface = {
      workbook: workbook,
      worksheet: worksheet,
      col: 0.28,
      row: 0.7,
    } as AssistExcelImageInterface
    await this.addImageLogo(assistExcelImageInterface)
    worksheet.getRow(1).height = 60
    const fgColor = '000000'
    worksheet.getCell('B1').value = title
    worksheet.getCell('B1').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.mergeCells('B1:R1')
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
    totalRowIncident.earlyOuts += row.earlyOuts
    totalRowIncident.rests += row.rests
    totalRowIncident.sundayBonus += row.sundayBonus
    totalRowIncident.vacations += row.vacations
    totalRowIncident.exeptions += row.exeptions
    totalRowIncident.holidaysWorked += row.holidaysWorked
    totalRowIncident.restWorked += row.restWorked
    totalRowIncident.faults += row.faults
    totalRowIncident.delayFaults += row.delayFaults
    totalRowIncident.earlyOutsFaults += row.earlyOutsFaults
    totalRowIncident.totalFaults += row.totalFaults
    totalRowIncident.hoursWorked += row.hoursWorked
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
    totalRowIncident.earlyOuts += rowByDepartment.earlyOuts
    totalRowIncident.rests += rowByDepartment.rests
    totalRowIncident.sundayBonus += rowByDepartment.sundayBonus
    totalRowIncident.vacations += rowByDepartment.vacations
    totalRowIncident.exeptions += rowByDepartment.exeptions
    totalRowIncident.holidaysWorked += rowByDepartment.holidaysWorked
    totalRowIncident.restWorked += rowByDepartment.restWorked
    totalRowIncident.faults += rowByDepartment.faults
    totalRowIncident.delayFaults += rowByDepartment.delayFaults
    totalRowIncident.earlyOutsFaults += rowByDepartment.earlyOutsFaults
    totalRowIncident.totalFaults += rowByDepartment.totalFaults
    totalRowIncident.hoursWorked += rowByDepartment.hoursWorked
  }

  cleanTotalByDepartment(totalRowIncident: AssistIncidentExcelRowInterface) {
    totalRowIncident.employeeId = ''
    totalRowIncident.employeeName = 'null'
    totalRowIncident.daysOnTime = 0
    totalRowIncident.tolerances = 0
    totalRowIncident.delays = 0
    totalRowIncident.earlyOuts = 0
    totalRowIncident.rests = 0
    totalRowIncident.sundayBonus = 0
    totalRowIncident.vacations = 0
    totalRowIncident.exeptions = 0
    totalRowIncident.holidaysWorked = 0
    totalRowIncident.restWorked = 0
    totalRowIncident.faults = 0
    totalRowIncident.delayFaults = 0
    totalRowIncident.earlyOutsFaults = 0
    totalRowIncident.totalFaults = 0
    totalRowIncident.hoursWorked = 0
  }

  getFaultsFromDelays(delays: number, tardies: number) {
    const faults = Math.floor(delays / tardies) // Cada 3 retardos es 1 falta
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

  createActionLog(rawHeaders: string[], action: string) {
    const date = DateTime.local().setZone('utc').toISO()
    const userAgent = this.getHeaderValue(rawHeaders, 'User-Agent')
    const secChUaPlatform = this.getHeaderValue(rawHeaders, 'sec-ch-ua-platform')
    const secChUa = this.getHeaderValue(rawHeaders, 'sec-ch-ua')
    const origin = this.getHeaderValue(rawHeaders, 'Origin')
    const logAssist = {
      action: action,
      user_agent: userAgent,
      sec_ch_ua_platform: secChUaPlatform,
      sec_ch_ua: secChUa,
      origin: origin,
      date: date ? date : '',
    } as LogAssist
    return logAssist
  }

  async saveActionOnLog(logAssist: LogAssist) {
    try {
      await LogStore.set('log_assist', logAssist)
    } catch (err) {}
  }

  getHeaderValue(headers: Array<string>, headerName: string) {
    const index = headers.indexOf(headerName)
    return index !== -1 ? headers[index + 1] : null
  }

  async getFormatPayRoll(date: string) {
    try {
      const monthPeriod = Number.parseInt(DateTime.fromJSDate(new Date(date)).toFormat('LL'))
      const yearPeriod = Number.parseInt(DateTime.fromJSDate(new Date(date)).toFormat('yyyy'))
      const dayPeriod = Number.parseInt(DateTime.fromJSDate(new Date(date)).toFormat('dd'))
      const dateLocal = DateTime.local(yearPeriod, monthPeriod, dayPeriod)
      const startOfWeek = dateLocal.startOf('week')
      const thursday = startOfWeek.plus({ days: 3 })
      const start = thursday.minus({ days: 24 })
      const firstDayPeriod = start.minus({ days: 1 }).startOf('day').setZone('utc')
      const tardies = await this.getTardiesTolerance()
      const syncAssistsService = new SyncAssistsService()
      const period = this.calculatePayPeriod(date)
      const dateNew = new Date(date)
      const year = dateNew.getFullYear()
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Inc SA2 p01')
      const businessConf = `${env.get('SYSTEM_BUSINESS')}`
      const businessList = businessConf.split(',')
      const businessUnits = await BusinessUnit.query()
        .where('business_unit_active', 1)
        .whereIn('business_unit_slug', businessList)
      const businessUnitsList = businessUnits.map((business) => business.businessUnitId)
      worksheet.columns = [
        { key: 'inc' },
        { key: 'sa2' },
        { key: 'ordinary' },
        { key: 'employee' },
        { key: 'year' },
        { key: 'period' },
        { key: 'code' },
        { key: 'date' },
        { key: 'faults' },
      ]
      const employees = await Employee.query()
        .whereIn('businessUnitId', businessUnitsList)
        .whereNull('employee_deleted_at')
        .orderBy('employee_id')
      const firstDate = firstDayPeriod.toFormat('yyyy-MM-dd')
      const lastDate = firstDayPeriod.plus({ days: 13 }).startOf('day').setZone('utc')
      let faultsTotal = 0
      for await (const employee of employees) {
        const result = await syncAssistsService.index(
          {
            date: firstDate,
            dateEnd: lastDate.toFormat('yyyy-MM-dd'),
            employeeID: employee.employeeId,
          },
          { page: 1, limit: 100 }
        )
        const data: any = result.data
        if (data) {
          const employeeCalendar = data.employeeCalendar as AssistDayInterface[]
          const faults = await this.getFaultsFromEmployeeCalendar(employeeCalendar, tardies)
          faultsTotal += faults
          if (faults > 0) {
            worksheet.addRow({
              inc: 'INC',
              sa2: 'SA2',
              ordinary: 'ORDINARI',
              employee: employee.employeeCode,
              year: year,
              period: period,
              code: 'faults',
              date: firstDate,
              faults: faults,
            })
          }
        }
      }
      const buffer = await workbook.csv.writeBuffer()

      return {
        status: 201,
        type: 'success',
        title: 'CSV',
        message: 'CSV was created successfully',
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

  async getFaultsFromEmployeeCalendar(employeeCalendar: AssistDayInterface[], tardies: number) {
    let daysWorked = 0
    let daysOnTime = 0
    let tolerances = 0
    let delays = 0
    let earlyOuts = 0
    let rests = 0
    let sundayBonus = 0
    let vacations = 0
    let holidaysWorked = 0
    let restWorked = 0
    let faults = 0
    let delayFaults = 0
    let earlyOutsFaults = 0
    const exceptions = [] as ShiftExceptionInterface[]
    for await (const calendar of employeeCalendar) {
      if (!calendar.assist.isFutureDay) {
        let laborRestCounted = false
        if (calendar.assist.exceptions.length > 0) {
          for await (const exception of calendar.assist.exceptions) {
            if (exception.exceptionType) {
              const exceptionTypeSlug = exception.exceptionType.exceptionTypeSlug
              if (exceptionTypeSlug !== 'rest-day' && exceptionTypeSlug !== 'vacation') {
                exceptions.push(exception)
              }
              if (exceptionTypeSlug === 'descanso-laborado') {
                if (
                  exception.shiftExceptionEnjoymentOfSalary &&
                  exception.shiftExceptionEnjoymentOfSalary === 1 &&
                  calendar.assist.checkIn
                ) {
                  restWorked += 1
                  laborRestCounted = true
                }
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
          if (calendar.assist.checkOutStatus !== 'fault') {
            if (calendar.assist.checkOutStatus === 'delay') {
              earlyOuts += 1
            }
          }
          if (
            calendar.assist.isSundayBonus &&
            (calendar.assist.checkIn ||
              calendar.assist.checkOut ||
              (calendar.assist.assitFlatList && calendar.assist.assitFlatList.length > 0))
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
          if (!laborRestCounted) {
            restWorked += 1
          }
        }
      }
    }
    delayFaults = this.getFaultsFromDelays(delays, tardies)
    earlyOutsFaults = this.getFaultsFromDelays(earlyOuts, tardies)
    faults = faults + delayFaults + earlyOutsFaults
    return faults
  }

  isPayThursday(dateToCheck: string, referencePayDate: string): boolean {
    const referenceDate = new Date(referencePayDate)
    const targetDate = new Date(dateToCheck)
    if (Number.isNaN(referenceDate.getTime())) {
      return false
    }
    if (Number.isNaN(targetDate.getTime())) {
      return false
    }
    const isThursday = targetDate.getDay() === 4
    if (!isThursday) {
      return false
    }
    const differenceInMilliseconds = targetDate.getTime() - referenceDate.getTime()
    const differenceInDays = Math.abs(differenceInMilliseconds / (1000 * 60 * 60 * 24))

    return differenceInDays % 14 === 0
  }

  calculatePayPeriod(datePay: string) {
    const date = DateTime.fromISO(datePay)
    if (!date.isValid) {
      return 0
    }
    const dayOfYear = date.ordinal
    const payPeriodNumber = Math.ceil(dayOfYear / 14)

    return payPeriodNumber
  }

  async getLogo() {
    let imageLogo = `${env.get('BACKGROUND_IMAGE_LOGO')}`
    const systemSettingService = new SystemSettingService()
    const systemSettingActive = (await systemSettingService.getActive()) as unknown as SystemSetting
    if (systemSettingActive) {
      if (systemSettingActive.systemSettingLogo) {
        imageLogo = systemSettingActive.systemSettingLogo
      }
    }
    return imageLogo
  }

  async addTitleIncidentPayrollToWorkSheet(
    workbook: ExcelJS.Workbook,
    worksheet: ExcelJS.Worksheet,
    title: string
  ) {
    worksheet.addRow([title])
    worksheet.addRow(['', '', '', title])
    const assistExcelImageInterface = {
      workbook: workbook,
      worksheet: worksheet,
      col: 14.2,
      row: 1.2,
    } as AssistExcelImageInterface
    await this.addImageLogo(assistExcelImageInterface)
    worksheet.getRow(2).height = 45
    const fgColor = 'FFFFFF'

    worksheet.getCell('D2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('F2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('G2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('H2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('I2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('J2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('K2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('L2').font = { bold: true, size: 18, color: { argb: fgColor } }
    let cell = worksheet.getCell(2, 4)
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '203864' },
    }
    worksheet.getCell('D2').alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.mergeCells('D2:L2')
    worksheet.mergeCells('A2:C4')
    worksheet.mergeCells('M2:O4')
    worksheet.mergeCells('A1:O1')
    worksheet.mergeCells('D3:L4')
    cell = worksheet.getCell(3, 4)
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    }
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }, // Fija la primera fila
      { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
      { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
      { state: 'frozen', ySplit: 5 }, // Fija la tercer fila
    ]
  }

  addHeadRowIncidentPayroll(worksheet: ExcelJS.Worksheet) {
    const headerRow = worksheet.addRow([
      'NOMBRE COMPLETO',
      'ID',
      'DEPARTAMENTO',
      'EMPRESA',
      'FALTA',
      'RETARDO',
      'INC',
      'HRS EX. DOB.',
      'HRS EX. TRI.',
      'P. DOM.',
      'DESC. LAB.',
      'P. VAC.',
      'NIVELACION',
      'BONO',
      'OTROS',
    ])
    let fgColor = '000000'
    let color = 'C9C9C9'
    for (let col = 1; col <= 4; col++) {
      const cell = worksheet.getCell(5, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = '305496'
    for (let col = 5; col <= 7; col++) {
      const cell = worksheet.getCell(5, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = 'A9D08E'
    for (let col = 8; col <= 14; col++) {
      const cell = worksheet.getCell(5, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = '305496'
    for (let col = 15; col <= 15; col++) {
      const cell = worksheet.getCell(5, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    headerRow.height = 40
    fgColor = '000000'
    headerRow.font = { bold: true, color: { argb: fgColor } }
    fgColor = 'FFFFFF'
    const columnA = worksheet.getColumn(1)
    columnA.width = 42
    const columnB = worksheet.getColumn(2)
    columnB.width = 10
    const columnC = worksheet.getColumn(3)
    columnC.width = 17
    const columnD = worksheet.getColumn(4)
    columnD.width = 13
    for (let index = 1; index <= 4; index++) {
      const cell = worksheet.getCell(5, index)
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    }
    const columnE = worksheet.getColumn(5)
    columnE.width = 10
    for (let col = 5; col <= 7; col++) {
      const cell = worksheet.getCell(5, col)
      cell.font = { color: { argb: fgColor } }
    }
    columnE.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnF = worksheet.getColumn(6)
    columnF.width = 10
    columnF.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnG = worksheet.getColumn(7)
    columnG.width = 10
    columnG.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnH = worksheet.getColumn(8)
    columnH.width = 14
    columnH.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnI = worksheet.getColumn(9)
    columnI.width = 14
    columnI.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnJ = worksheet.getColumn(10)
    columnJ.width = 14
    columnJ.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnK = worksheet.getColumn(11)
    columnK.width = 14
    columnK.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnL = worksheet.getColumn(12)
    columnL.width = 14
    columnL.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnM = worksheet.getColumn(13)
    columnM.width = 14
    columnM.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnN = worksheet.getColumn(14)
    columnN.width = 14
    columnN.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnO = worksheet.getColumn(15)
    columnO.width = 40
    columnO.font = { color: { argb: fgColor } }
    columnO.alignment = { vertical: 'middle', horizontal: 'center' }
  }

  async addRowIncidentPayrollCalendar(
    employee: Employee,
    employeeCalendar: AssistDayInterface[],
    tardies: number,
    datePay: string
  ) {
    const rows = [] as AssistIncidentPayrollExcelRowInterface[]
    let department = employee.department.departmentAlias ? employee.department.departmentAlias : ''
    department =
      department === '' && employee.department?.departmentName
        ? employee.department.departmentName
        : department
    let daysWorked = 0
    let daysOnTime = 0
    let tolerances = 0
    let delays = 0
    let earlyOuts = 0
    let rests = 0
    let sundayBonus = 0
    let laborRest = 0
    let overtimeDouble = 0
    let vacations = 0
    let holidaysWorked = 0
    let faults = 0
    let delayFaults = 0
    let earlyOutsFaults = 0
    let vacationBonus = 0
    const exceptions = [] as ShiftExceptionInterface[]
    for await (const calendar of employeeCalendar) {
      if (!calendar.assist.isFutureDay) {
        let laborRestCounted = false
        if (calendar.assist.exceptions.length > 0) {
          for await (const exception of calendar.assist.exceptions) {
            if (exception.exceptionType) {
              const exceptionTypeSlug = exception.exceptionType.exceptionTypeSlug
              if (exceptionTypeSlug !== 'rest-day' && exceptionTypeSlug !== 'vacation') {
                exceptions.push(exception)
              }
              if (exceptionTypeSlug === 'descanso-laborado') {
                if (
                  exception.shiftExceptionEnjoymentOfSalary &&
                  exception.shiftExceptionEnjoymentOfSalary === 1 &&
                  calendar.assist.checkIn
                ) {
                  laborRest += 1
                  laborRestCounted = true
                }
              } else if (
                exceptionTypeSlug === 'working-during-non-working-hours' &&
                exception.shiftExceptionEnjoymentOfSalary === 1
              ) {
                if (exception.shiftExceptionCheckInTime && exception.shiftExceptionCheckOutTime) {
                  const checkIn = DateTime.fromFormat(
                    exception.shiftExceptionCheckInTime,
                    'HH:mm:ss'
                  )
                  const checkOut = DateTime.fromFormat(
                    exception.shiftExceptionCheckOutTime,
                    'HH:mm:ss'
                  )
                  const duration = checkOut.diff(checkIn, 'hours')
                  overtimeDouble += Math.floor(duration.hours)
                }
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
          if (calendar.assist.checkOutStatus !== 'fault') {
            if (calendar.assist.checkOutStatus === 'delay') {
              earlyOuts += 1
            }
          }
          if (
            calendar.assist.isSundayBonus &&
            (calendar.assist.checkIn ||
              calendar.assist.checkOut ||
              (calendar.assist.assitFlatList && calendar.assist.assitFlatList.length > 0))
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
          if (!laborRestCounted) {
            laborRest += 1
          }
        }
      }
    }
    delayFaults = this.getFaultsFromDelays(delays, tardies)
    earlyOutsFaults = this.getFaultsFromDelays(earlyOuts, tardies)
    vacationBonus = this.getVacationBonus(employee, datePay)
    let company = ''
    if (employee.businessUnitId) {
      const businessUnit = await BusinessUnit.query()
        .whereNull('business_unit_deleted_at')
        .where('business_unit_id', employee.businessUnitId)
        .first()
      if (businessUnit) {
        company = businessUnit.businessUnitName
      }
    }
    rows.push({
      employeeName: `${employee.employeeFirstName} ${employee.employeeLastName}`,
      employeeId: employee.employeeCode.toString(),
      department: department,
      company: company,
      faults: faults,
      delays: delayFaults + earlyOutsFaults,
      inc: '',
      overtimeDouble: overtimeDouble,
      overtimeTriple: '',
      sundayBonus: sundayBonus,
      laborRest: laborRest,
      vacationBonus: vacationBonus,
      leveling: '',
      bonus: '',
      others: '',
    })
    return rows
  }

  async addRowIncidentPayrollToWorkSheet(
    rows: AssistIncidentPayrollExcelRowInterface[],
    worksheet: ExcelJS.Worksheet
  ) {
    let rowCount = 5
    for await (const rowData of rows) {
      if (rowData.employeeName !== 'null') {
        const fgColor = '000000'
        worksheet.addRow([
          rowData.employeeName,
          rowData.employeeId,
          rowData.department,
          rowData.company,
          rowData.faults ? rowData.faults : '',
          rowData.delays ? rowData.delays : '',
          rowData.inc,
          rowData.overtimeDouble ? rowData.overtimeDouble : '',
          rowData.overtimeTriple,
          rowData.sundayBonus ? rowData.sundayBonus : '',
          rowData.laborRest ? rowData.laborRest : '',
          rowData.vacationBonus ? rowData.vacationBonus : '',
          rowData.leveling,
          rowData.bonus,
          rowData.others,
        ]).font = { color: { argb: fgColor } }
        let cell = worksheet.getCell(rowCount + 1, 4)
        cell.font = { bold: true }
        if (rowData.faults > 0) {
          cell = worksheet.getCell(rowCount + 1, 5)
          cell.font = { color: { argb: '9C0006' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC7CE' },
          }
        }
        if (rowData.delays > 0) {
          cell = worksheet.getCell(rowCount + 1, 6)
          cell.font = { color: { argb: '9C0006' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC7CE' },
          }
        }
        if (rowData.overtimeDouble > 0) {
          cell = worksheet.getCell(rowCount + 1, 8)
          cell.font = { color: { argb: '006100' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          }
        }
        if (rowData.sundayBonus > 0) {
          cell = worksheet.getCell(rowCount + 1, 10)
          cell.font = { color: { argb: '006100' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          }
        }
        if (rowData.vacationBonus > 0) {
          cell = worksheet.getCell(rowCount + 1, 12)
          cell.font = { color: { argb: '006100' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          }
        }
        if (rowData.laborRest > 0) {
          cell = worksheet.getCell(rowCount + 1, 11)
          cell.font = { color: { argb: '006100' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          }
        }
        rowCount += 1
      }
    }
  }

  async getTradeName() {
    let tradeName = 'BO'
    const systemSettingService = new SystemSettingService()
    const systemSettingActive = (await systemSettingService.getActive()) as unknown as SystemSetting
    if (systemSettingActive) {
      if (systemSettingActive.systemSettingTradeName) {
        tradeName = systemSettingActive.systemSettingTradeName
      }
    }
    return tradeName
  }

  paintBorderAll(worksheet: ExcelJS.Worksheet, rowCount: number) {
    for (let rowIndex = 6; rowIndex <= rowCount + 5; rowIndex++) {
      const row = worksheet.getRow(rowIndex)
      for (let colNumber = 1; colNumber <= 15; colNumber++) {
        const cell = row.getCell(colNumber)
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } },
        }
      }
    }
  }

  async addImageLogo(assistExcelImageInterface: AssistExcelImageInterface) {
    const imageLogo = await this.getLogo()
    const imageResponse = await axios.get(imageLogo, { responseType: 'arraybuffer' })
    const imageBuffer = imageResponse.data

    const metadata = await sharp(imageBuffer).metadata()
    const imageWidth = metadata.width ? metadata.width : 0
    const imageHeight = metadata.height ? metadata.height : 0

    const targetWidth = 139
    const targetHeight = 49

    const scale = Math.min(targetWidth / imageWidth, targetHeight / imageHeight)

    let adjustedWidth = imageWidth * scale
    let adjustedHeight = imageHeight * scale

    if (assistExcelImageInterface.col === 14.2) {
      const increaseFactor = 1.3
      adjustedWidth *= increaseFactor
      adjustedHeight *= increaseFactor
    }

    const imageId = assistExcelImageInterface.workbook.addImage({
      buffer: imageBuffer,
      extension: 'png',
    })

    assistExcelImageInterface.worksheet.addImage(imageId, {
      tl: { col: assistExcelImageInterface.col, row: assistExcelImageInterface.row },
      ext: { width: adjustedWidth, height: adjustedHeight },
    })
  }

  decimalToTimeString(decimal: number): string {
    const hours = Math.floor(decimal)
    const minutes = Math.round((decimal - hours) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  async getTardiesTolerance() {
    let tardies = 0
    const systemSettingService = new SystemSettingService()
    const systemSettingActive = (await systemSettingService.getActive()) as unknown as SystemSetting
    if (systemSettingActive) {
      const tolerance = await Tolerance.query()
        .whereNull('tolerance_deleted_at')
        .where('tolerance_name', 'TardinessTolerance')
        .where('systemSettingId', systemSettingActive.systemSettingId)
        .first()

      if (tolerance) {
        tardies = tolerance.toleranceMinutes
      }
    }

    if (tardies === 0) {
      tardies = 3
    }
    return tardies
  }

  getVacationBonus(employee: Employee, datePay: string) {
    if (!employee.employeeHireDate) {
      return 0
    }
    if (!datePay) {
      return 0
    }

    if (!this.isFirstPayMonth(datePay)) {
      return 0
    }

    if (this.isAnniversaryInPayMonth(employee.employeeHireDate.toString(), datePay)) {
      return 1
    }

    return 0
  }

  isFirstPayMonth(dateString: string) {
    const date = new Date(dateString)
    const dayOfMonth = date.getDate()

    return dayOfMonth >= 1 && dayOfMonth <= 15
  }

  isAnniversaryInPayMonth(hireDate: string, payDate: string) {
    const hire = new Date(hireDate)
    const pay = new Date(payDate)

    return hire.getMonth() === pay.getMonth()
  }

  isFirstPaycheckOnAnniversary(employee: Employee) {
    if (!employee.employeeHireDate) {
      return false
    }

    const hireDate = DateTime.fromISO(employee.employeeHireDate.toString())

    const today = DateTime.local()

    const isAnniversary = today.month === hireDate.month && today.day === hireDate.day

    const isFirstPaycheck = today.day >= 1 && today.day <= 15

    return isAnniversary && isFirstPaycheck
  }
}
