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
        for await (const calendar of employeeCalendar) {
          const day = this.dateDay(calendar.day)
          const month = this.dateMonth(calendar.day)
          const year = this.dateYear(calendar.day)
          const calendarDay = this.calendarDayMonth(year, month, day)
          const weekDayName = this.weekDayName(year, month, day)
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
          rows.push({
            name: `${employee.employeeFirstName} ${employee.employeeLastName}`,
            department: department,
            position: position,
            date: calendarDay,
            dayOfWeek: weekDayName,
            checkInTime: calendar.assist.checkInDateTime
              ? DateTime.fromISO(calendar.assist.checkInDateTime.toString(), { setZone: true })
                  .setZone('America/Mexico_City')
                  .toFormat('ff')
              : '',
            firstCheck: firstCheck,
            lunchTime: calendar.assist.checkEatIn
              ? DateTime.fromISO(calendar.assist.checkEatIn.toString(), {
                  setZone: true,
                })
                  .setZone('America/Mexico_City')
                  .toFormat('ff')
              : '',
            returnLunchTime: calendar.assist.checkEatOut
              ? DateTime.fromISO(calendar.assist.checkEatOut.toString(), {
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
          })
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')

      // Agregar título del reporte en negritas
      const titleRow = worksheet.addRow(['Assistance Report'])
      titleRow.font = { bold: true, size: 24 }
      titleRow.height = 20
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A1:M1')

      const periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
      periodRow.font = { size: 15 }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:M2')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
      ]
      // Añadir columnas de datos (encabezados)
      const headerRow = worksheet.addRow([
        'Nombre',
        'Departamento',
        'Cargo',
        'Fecha',
        'Día de la semana',
        'Hora de entrada',
        'Check-in',
        'Hora de salida a comer',
        'Hora de regreso de comer',
        'Hora de salida',
        'Check-out',
        'Incidencias',
        'Notas',
        'Prima dominical',
      ])
      headerRow.font = { bold: true }
      let rowCount = 4
      // Añadir filas de datos (esto es un ejemplo, puedes obtener estos datos de tu base de datos)
      for await (const rowData of rows) {
        worksheet.addRow([
          rowData.name,
          rowData.department,
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
        if (rowData.name) {
          this.paintIncidents(worksheet, rowCount, rowData.incidents)
        }
        rowCount += 1
      }
      const columnA = worksheet.getColumn(1)
      columnA.width = 44
      const columnB = worksheet.getColumn(2)
      columnB.width = 44
      const columnC = worksheet.getColumn(3)
      columnC.width = 44
      const columnD = worksheet.getColumn(4)
      columnD.width = 25
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
      columnK.width = 25
      columnK.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnL = worksheet.getColumn(12)
      columnL.width = 30
      columnL.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnM = worksheet.getColumn(13)
      columnM.width = 30
      columnM.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnN = worksheet.getColumn(14)
      columnN.width = 30
      columnN.alignment = { vertical: 'middle', horizontal: 'center' }
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
      const resultEmployes = await employeeService.index({
        search: '',
        departmentId: departmentId,
        positionId: positionId,
        employeeWorkSchedule: '',
        page: page,
        limit: limit,
      })
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
          for await (const calendar of employeeCalendar) {
            const day = this.dateDay(calendar.day)
            const month = this.dateMonth(calendar.day)
            const year = this.dateYear(calendar.day)
            const calendarDay = this.calendarDayMonth(year, month, day)
            const weekDayName = this.weekDayName(year, month, day)
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
              position === '' && employee.position?.positionName
                ? employee.position.positionName
                : ''
            rows.push({
              name: `${employee.employeeFirstName} ${employee.employeeLastName}`,
              department: department,
              position: position,
              date: calendarDay,
              dayOfWeek: weekDayName,
              checkInTime: calendar.assist.checkInDateTime
                ? DateTime.fromISO(calendar.assist.checkInDateTime.toString(), { setZone: true })
                    .setZone('America/Mexico_City')
                    .toFormat('ff')
                : '',
              firstCheck: firstCheck,
              lunchTime: calendar.assist.checkEatIn
                ? DateTime.fromISO(calendar.assist.checkEatIn.toString(), {
                    setZone: true,
                  })
                    .setZone('America/Mexico_City')
                    .toFormat('ff')
                : '',
              returnLunchTime: calendar.assist.checkEatOut
                ? DateTime.fromISO(calendar.assist.checkEatOut.toString(), {
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
            })
          }
          this.addRowExcelEmpty(rows)
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')

      // Agregar título del reporte en negritas
      const titleRow = worksheet.addRow(['Assistance Report'])
      titleRow.font = { bold: true, size: 24 }
      titleRow.height = 20
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A1:M1')

      const periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
      periodRow.font = { size: 15 }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:M2')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
      ]
      // Añadir columnas de datos (encabezados)
      const headerRow = worksheet.addRow([
        'Nombre',
        'Departamento',
        'Cargo',
        'Fecha',
        'Día de la semana',
        'Hora de entrada',
        'Check-in',
        'Hora de salida a comer',
        'Hora de regreso de comer',
        'Hora de salida',
        'Check-out',
        'Incidencias',
        'Notas',
        'Prima dominical',
      ])
      headerRow.font = { bold: true }
      let rowCount = 4
      // Añadir filas de datos (esto es un ejemplo, puedes obtener estos datos de tu base de datos)
      for await (const rowData of rows) {
        worksheet.addRow([
          rowData.name,
          rowData.department,
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
        if (rowData.name) {
          this.paintIncidents(worksheet, rowCount, rowData.incidents)
        }
        rowCount += 1
      }
      const columnA = worksheet.getColumn(1)
      columnA.width = 44
      const columnB = worksheet.getColumn(2)
      columnB.width = 44
      const columnC = worksheet.getColumn(3)
      columnC.width = 44
      const columnD = worksheet.getColumn(4)
      columnD.width = 25
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
      columnK.width = 25
      columnK.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnL = worksheet.getColumn(12)
      columnL.width = 30
      columnL.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnM = worksheet.getColumn(13)
      columnM.width = 30
      columnM.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnN = worksheet.getColumn(14)
      columnN.width = 30
      columnN.alignment = { vertical: 'middle', horizontal: 'center' }
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
        const resultEmployes = await employeeService.index({
          search: '',
          departmentId: departmentId,
          positionId: position.positionId,
          employeeWorkSchedule: '',
          page: page,
          limit: limit,
        })
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
            for await (const calendar of employeeCalendar) {
              const day = this.dateDay(calendar.day)
              const month = this.dateMonth(calendar.day)
              const year = this.dateYear(calendar.day)
              const calendarDay = this.calendarDayMonth(year, month, day)
              const weekDayName = this.weekDayName(year, month, day)
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
              let positionName = employee.position.positionAlias
                ? employee.position.positionAlias
                : ''
              positionName =
                positionName === '' && employee.position?.positionName
                  ? employee.position.positionName
                  : ''
              rows.push({
                name: `${employee.employeeFirstName} ${employee.employeeLastName}`,
                department: department,
                position: positionName,
                date: calendarDay,
                dayOfWeek: weekDayName,
                checkInTime: calendar.assist.checkInDateTime
                  ? DateTime.fromISO(calendar.assist.checkInDateTime.toString(), { setZone: true })
                      .setZone('America/Mexico_City')
                      .toFormat('ff')
                  : '',
                firstCheck: firstCheck,
                lunchTime: calendar.assist.checkEatIn
                  ? DateTime.fromISO(calendar.assist.checkEatIn.toString(), {
                      setZone: true,
                    })
                      .setZone('America/Mexico_City')
                      .toFormat('ff')
                  : '',
                returnLunchTime: calendar.assist.checkEatOut
                  ? DateTime.fromISO(calendar.assist.checkEatOut.toString(), {
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
              })
            }
            this.addRowExcelEmpty(rows)
          }
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')

      // Agregar título del reporte en negritas
      const titleRow = worksheet.addRow(['Assistance Report'])
      titleRow.font = { bold: true, size: 24 }
      titleRow.height = 20
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A1:M1')

      const periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
      periodRow.font = { size: 15 }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:M2')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
      ]
      // Añadir columnas de datos (encabezados)
      const headerRow = worksheet.addRow([
        'Nombre',
        'Departamento',
        'Cargo',
        'Fecha',
        'Día de la semana',
        'Hora de entrada',
        'Check-in',
        'Hora de salida a comer',
        'Hora de regreso de comer',
        'Hora de salida',
        'Check-out',
        'Incidencias',
        'Notas',
        'Prima dominical',
      ])
      headerRow.font = { bold: true }
      let rowCount = 4
      // Añadir filas de datos (esto es un ejemplo, puedes obtener estos datos de tu base de datos)
      for await (const rowData of rows) {
        worksheet.addRow([
          rowData.name,
          rowData.department,
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
        if (rowData.name) {
          this.paintIncidents(worksheet, rowCount, rowData.incidents)
        }
        rowCount += 1
      }
      const columnA = worksheet.getColumn(1)
      columnA.width = 44
      const columnB = worksheet.getColumn(2)
      columnB.width = 44
      const columnC = worksheet.getColumn(3)
      columnC.width = 44
      const columnD = worksheet.getColumn(4)
      columnD.width = 25
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
      columnK.width = 25
      columnK.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnL = worksheet.getColumn(12)
      columnL.width = 30
      columnL.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnM = worksheet.getColumn(13)
      columnM.width = 30
      columnM.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnN = worksheet.getColumn(14)
      columnN.width = 30
      columnN.alignment = { vertical: 'middle', horizontal: 'center' }
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

  async getExcelAll(filters: AssistExcelFilterInterface) {
    try {
      const departments = await Department.query()
        .whereNull('department_deleted_at')
        .orderBy('department_id')
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
          const resultEmployes = await employeeService.index({
            search: '',
            departmentId: departmentId,
            positionId: position.positionId,
            page: page,
            limit: limit,
          })
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
              for await (const calendar of employeeCalendar) {
                const day = this.dateDay(calendar.day)
                const month = this.dateMonth(calendar.day)
                const year = this.dateYear(calendar.day)
                const calendarDay = this.calendarDayMonth(year, month, day)
                const weekDayName = this.weekDayName(year, month, day)
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
                let positionName = employee.position.positionAlias
                  ? employee.position.positionAlias
                  : ''
                positionName =
                  positionName === '' && employee.position?.positionName
                    ? employee.position.positionName
                    : ''
                rows.push({
                  name: `${employee.employeeFirstName} ${employee.employeeLastName}`,
                  department: department,
                  position: positionName,
                  date: calendarDay,
                  dayOfWeek: weekDayName,
                  checkInTime: calendar.assist.checkInDateTime
                    ? DateTime.fromISO(calendar.assist.checkInDateTime.toString(), {
                        setZone: true,
                      })
                        .setZone('America/Mexico_City')
                        .toFormat('ff')
                    : '',
                  firstCheck: firstCheck,
                  lunchTime: calendar.assist.checkEatIn
                    ? DateTime.fromISO(calendar.assist.checkEatIn.toString(), {
                        setZone: true,
                      })
                        .setZone('America/Mexico_City')
                        .toFormat('ff')
                    : '',
                  returnLunchTime: calendar.assist.checkEatOut
                    ? DateTime.fromISO(calendar.assist.checkEatOut.toString(), {
                        setZone: true,
                      })
                        .setZone('America/Mexico_City')
                        .toFormat('ff')
                    : '',
                  checkOutTime: calendar.assist.checkOutDateTime
                    ? DateTime.fromISO(calendar.assist.checkOutDateTime.toString(), {
                        setZone: true,
                      })
                        .setZone('America/Mexico_City')
                        .toFormat('ff')
                    : '',
                  lastCheck: lastCheck,
                  incidents: status,
                  notes: '',
                  sundayPremium: '',
                })
              }
              this.addRowExcelEmpty(rows)
            }
          }
        }
      }
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Datos')

      // Agregar título del reporte en negritas
      const titleRow = worksheet.addRow(['Assistance Report'])
      titleRow.font = { bold: true, size: 24 }
      titleRow.height = 20
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A1:M1')

      const periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
      periodRow.font = { size: 15 }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:M2')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
      ]
      // Añadir columnas de datos (encabezados)
      const headerRow = worksheet.addRow([
        'Nombre',
        'Departamento',
        'Cargo',
        'Fecha',
        'Día de la semana',
        'Hora de entrada',
        'Check-in',
        'Hora de salida a comer',
        'Hora de regreso de comer',
        'Hora de salida',
        'Check-out',
        'Incidencias',
        'Notas',
        'Prima dominical',
      ])
      headerRow.font = { bold: true }
      // Añadir filas de datos (esto es un ejemplo, puedes obtener estos datos de tu base de datos)
      let rowCount = 4
      for await (const rowData of rows) {
        worksheet.addRow([
          rowData.name,
          rowData.department,
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
        if (rowData.name) {
          this.paintIncidents(worksheet, rowCount, rowData.incidents)
        }
        rowCount += 1
      }
      const columnA = worksheet.getColumn(1)
      columnA.width = 44
      const columnB = worksheet.getColumn(2)
      columnB.width = 44
      const columnC = worksheet.getColumn(3)
      columnC.width = 44
      const columnD = worksheet.getColumn(4)
      columnD.width = 25
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
      columnK.width = 25
      columnK.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnL = worksheet.getColumn(12)
      columnL.width = 30
      columnL.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnM = worksheet.getColumn(13)
      columnM.width = 30
      columnM.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnN = worksheet.getColumn(14)
      columnN.width = 30
      columnN.alignment = { vertical: 'middle', horizontal: 'center' }
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
    worksheet.getCell('L' + row).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }, // Color de fondo rojo
    }
    worksheet.getCell('L' + row).font = {
      color: { argb: fgColor }, // Color de fondo rojo
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
      name: '',
      department: '',
      position: '',
      date: '',
      dayOfWeek: '',
      checkInTime: '',
      firstCheck: '',
      lunchTime: '',
      returnLunchTime: '',
      checkOutTime: '',
      lastCheck: '',
      incidents: '',
      notes: '',
      sundayPremium: '',
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

  private weekDayName(dateYear: number, dateMonth: number, dateDay: number) {
    const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
    const day = date.toFormat('cccc')
    return day
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
}
