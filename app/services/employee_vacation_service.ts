import { DateTime } from 'luxon'
import ExcelJS from 'exceljs'
import Employee from '#models/employee'
import { EmployeeVacationExcelFilterInterface } from '../interfaces/employee_vacation_excel_filter_interface.js'
import EmployeeService from './employee_service.js'
import { EmployeeVacationExcelRowInterface } from '../interfaces/employee_vacation_excel_row_interface.js'
import Env from '#start/env'
import BusinessUnit from '#models/business_unit'

export default class EmployeeVacationService {
  async getExcelAll(filters: EmployeeVacationExcelFilterInterface) {
    try {
      const businessConf = `${Env.get('SYSTEM_BUSINESS')}`
      const businessList = businessConf.split(',')
      const businessUnits = await BusinessUnit.query()
        .where('business_unit_active', 1)
        .whereIn('business_unit_slug', businessList)
      const businessUnitsList = businessUnits.map((business) => business.businessUnitId)
      const employees = await Employee.query()
        .if(filters.search, (query) => {
          query.where((subQuery) => {
            subQuery
              .whereRaw('UPPER(CONCAT(employee_first_name, " ", employee_last_name)) LIKE ?', [
                `%${filters.search.toUpperCase()}%`,
              ])
              .orWhereRaw('UPPER(employee_code) = ?', [`${filters.search.toUpperCase()}`])
              .orWhereHas('person', (personQuery) => {
                personQuery.whereRaw('UPPER(person_rfc) LIKE ?', [
                  `%${filters.search.toUpperCase()}%`,
                ])
                personQuery.orWhereRaw('UPPER(person_curp) LIKE ?', [
                  `%${filters.search.toUpperCase()}%`,
                ])
                personQuery.orWhereRaw('UPPER(person_imss_nss) LIKE ?', [
                  `%${filters.search.toUpperCase()}%`,
                ])
              })
          })
        })
        .if(filters.departmentId > 0, (query) => {
          query.where('department_id', filters.departmentId)
        })
        .if(filters.positionId > 0, (query) => {
          query.where('position_id', filters.positionId)
        })
        .if(filters.employeeId > 0, (query) => {
          query.where('employee_id', filters.employeeId)
        })
        .if(
          filters.onlyInactive &&
            (filters.onlyInactive === 'true' || filters.onlyInactive === true),
          (query) => {
            query.whereNotNull('employee_deleted_at')
            query.withTrashed()
          }
        )
        .whereIn('business_unit_id', businessUnitsList)
        .if(filters.userResponsibleId &&
          typeof filters.userResponsibleId && filters.userResponsibleId > 0,
          (query) => {
            query.whereHas('userResponsibleEmployee', (userResponsibleEmployeeQuery) => {
              userResponsibleEmployeeQuery.where('userId', filters.userResponsibleId!)
            })
          }
        )
        .preload('businessUnit')
        .preload('department')
        .preload('position')
        .orderBy('employee_code')
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      const years = []
      const start = DateTime.fromISO(filters.filterStartDate, { setZone: true }).setZone('UTC')
      const end = DateTime.fromISO(filters.filterEndDate, { setZone: true }).setZone('UTC')
      for (let year = start.year; year <= end.year; year++) {
        years.push(year)
      }
      for await (const year of years) {
        const sheet = workbook.addWorksheet(`${year}`)
        await this.addHeadRow(sheet)
        const rows = await this.addEmployees(employees, year)
        await this.addRowToWorkSheet(rows, sheet)
        this.paintBorderAll(sheet, rows.length)
      }
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

  paintBorderAll(worksheet: ExcelJS.Worksheet, rowCount: number) {
    for (let rowIndex = 1; rowIndex <= rowCount + 1; rowIndex++) {
      const row = worksheet.getRow(rowIndex)
      for (let colNumber = 1; colNumber <= 25; colNumber++) {
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

  addHeadRow(worksheet: ExcelJS.Worksheet) {
    let fgColor = 'FFFFFFF'
    let color = '4EA72E'
    const headers = [
      'ID',
      'Employee',
      'Department',
      'Position',
      'Hire Date',
      'Employer Company',
      'Years',
      'Vac.',
      'Used',
      'Rest.',
    ]
    for (let i = 1; i <= 15; i++) {
      headers.push(`Date ${i}`)
    }
    // Agregar los encabezados al worksheet
    const headerRow = worksheet.addRow(headers)
    color = '156082'
    for (let col = 1; col <= 25; col++) {
      const cell = worksheet.getCell(1, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    headerRow.height = 24
    headerRow.font = { bold: true, color: { argb: fgColor } }
    const columnA = worksheet.getColumn(1)
    columnA.width = 15
    columnA.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnB = worksheet.getColumn(2)
    columnB.width = 40
    columnB.alignment = { vertical: 'middle', horizontal: 'left' }
    const columnC = worksheet.getColumn(3)
    columnC.width = 64
    columnC.alignment = { vertical: 'middle', horizontal: 'left' }
    const columnD = worksheet.getColumn(4)
    columnD.width = 64
    columnD.alignment = { vertical: 'middle', horizontal: 'left' }
    const columnE = worksheet.getColumn(5)
    columnE.width = 16
    columnE.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnF = worksheet.getColumn(6)
    columnF.width = 55
    columnF.alignment = { vertical: 'middle', horizontal: 'left' }
    const columnG = worksheet.getColumn(7)
    columnG.width = 15
    columnG.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnH = worksheet.getColumn(8)
    columnH.width = 15
    columnH.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnI = worksheet.getColumn(9)
    columnI.width = 15
    columnI.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnJ = worksheet.getColumn(10)
    columnJ.width = 15
    columnJ.alignment = { vertical: 'middle', horizontal: 'center' }
    for (let index = 11; index <= 25; index++) {
      const columnDate = worksheet.getColumn(index)
      columnDate.width = 25
      columnDate.alignment = { vertical: 'middle', horizontal: 'center' }
    }
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }, // Fija la primera fila
    ]
    const row = worksheet.getRow(1)
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })
  }

  async addEmployees(employees: Employee[], year: number) {
    const employeeService = new EmployeeService()
    const rows = [] as EmployeeVacationExcelRowInterface[]
    for await (const employee of employees) {
      const yearsWorked = await employeeService.getYearWorked(employee, year)
      let yearsPassed = 0
      let daysVacations = 0
      let daysUsed = 0
      const vacationsUsed = [] as Array<string>
      if (yearsWorked.status === 200) {
        if (yearsWorked.data.vacationUsedList) {
          for await (const shiftException of yearsWorked.data.vacationUsedList) {
            vacationsUsed.push(this.getDateFromHttp(shiftException.shiftExceptionsDate.toString()))
          }
        }
        yearsPassed = yearsWorked.data.yearsPassed ? yearsWorked.data.yearsPassed : 0
        daysVacations = yearsWorked.data.vacationSetting?.vacationSettingVacationDays
          ? yearsWorked.data.vacationSetting?.vacationSettingVacationDays
          : 0
        daysUsed = yearsWorked.data.vacationUsedList ? yearsWorked.data.vacationUsedList.length : 0
      }
      const newRow = {
        employeeCode: employee.employeeCode.toString(),
        employeeName: `${employee.employeeFirstName} ${employee.employeeLastName}`,
        department: employee.department ? employee.department.departmentName : '',
        position: employee.position ? employee.position.positionName : '',
        employeeHireDate: employee.employeeHireDate
          ? this.getDate(employee.employeeHireDate.toString())
          : '',
        employerCompany: employee.businessUnit ? employee.businessUnit.businessUnitLegalName : '',
        years: yearsPassed,
        daysVacations: daysVacations,
        daysUsed: daysUsed,
        daysRest: daysVacations - daysUsed,
        vacationsUsed: vacationsUsed,
      } as EmployeeVacationExcelRowInterface
      rows.push(newRow)
    }
    return rows
  }

  async addRowToWorkSheet(rows: EmployeeVacationExcelRowInterface[], worksheet: ExcelJS.Worksheet) {
    for await (const rowData of rows) {
      const row = [
        rowData.employeeCode,
        rowData.employeeName,
        rowData.department,
        rowData.position,
        rowData.employeeHireDate,
        rowData.employerCompany,
        rowData.years,
        rowData.daysVacations,
        rowData.daysUsed,
        rowData.daysRest,
      ]
      if (rowData.vacationsUsed.length > 0) {
        for await (const vacation of rowData.vacationsUsed) {
          row.push(vacation)
        }
      }
      worksheet.addRow(row)
    }
  }
  getDate(date: string) {
    return DateTime.fromISO(date).toFormat('yyyy-MM-dd')
  }

  getDateFromHttp(date: string) {
    const dateObject = new Date(date)
    return DateTime.fromJSDate(dateObject).toFormat('yyyy-MM-dd')
  }
}
