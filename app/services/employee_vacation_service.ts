import { DateTime } from 'luxon'
import ExcelJS from 'exceljs'
import Employee from '#models/employee'
import { EmployeeVacationExcelFilterInterface } from '../interfaces/employee_vacation_excel_filter_interface.js'
import EmployeeService from './employee_service.js'
import { EmployeeVacationExcelRowInterface } from '../interfaces/employee_vacation_excel_row_interface.js'

export default class EmployeeVacationService {
  async getExcelAll(filters: EmployeeVacationExcelFilterInterface) {
    try {
      const employees = await Employee.query()
        .whereNull('employee_deleted_at')
        .if(filters.departmentId > 0, (query) => {
          query.where('department_id', filters.departmentId)
        })
        .if(filters.employeeId > 0, (query) => {
          query.where('employee_id', filters.employeeId)
        })
        .preload('position')
        .orderBy('employee_code')
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      /* let worksheet = workbook.addWorksheet('Assistance Report')
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
      //const periodRow = worksheet.addRow([this.getRange(filterDate, filterDateEnd)])
      //periodRow.font = { size: 15, color: { argb: fgColor } }

      worksheet.getCell('A' + 3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
     /*  periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      periodRow.height = 30 */
      /* worksheet.mergeCells('A3:P3')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
        { state: 'frozen', ySplit: 4 }, // Fija la cuarta fila
      ] */
      // Añadir columnas de datos (encabezados)
      // this.addHeadRow(worksheet)
      //await this.addRowToWorkSheet(rows, worksheet)
      // hasta aquí era lo de asistencia
      const years = []
      const start = DateTime.fromISO(filters.filterDate)
      const end = DateTime.fromISO(filters.filterDateEnd)
      for (let year = start.year; year <= end.year; year++) {
        years.push(year)
      }
      for await (const year of years) {
        const sheet = workbook.addWorksheet(`${year}`)
        // Agrega contenido de ejemplo a la hoja
        await this.addHeadRow(sheet)
        const rows = await this.addEmployees(employees, year)
        await this.addRowToWorkSheet(rows, sheet)
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

  addHeadRow(worksheet: ExcelJS.Worksheet) {
    const headers = [
      'Company',
      'ID',
      'Employee',
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
    let fgColor = 'FFFFFFF'
    let color = '156082'
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
    columnA.width = 16
    columnA.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnB = worksheet.getColumn(2)
    columnB.width = 15
    columnB.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnC = worksheet.getColumn(3)
    columnC.width = 40
    columnC.alignment = { vertical: 'middle', horizontal: 'left' }
    const columnD = worksheet.getColumn(4)
    columnD.width = 64
    columnD.alignment = { vertical: 'middle', horizontal: 'left' }
    const columnE = worksheet.getColumn(5)
    columnE.width = 16
    columnE.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnF = worksheet.getColumn(6)
    columnF.width = 55
    columnF.alignment = { vertical: 'middle', horizontal: 'center' }
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
  }

  async addEmployees(employees: Employee[], year: number) {
    const employeeService = new EmployeeService()
    const rows = [] as EmployeeVacationExcelRowInterface[]
    for await (const employee of employees) {
      const yearsWorked = await employeeService.getYearWorked(employee, year)
      let yearsPassed = ''
      let daysVacations = 0
      let daysUsed = 0
      if (yearsWorked.status === 200) {
        yearsPassed = yearsWorked.data.yearsPassed ? yearsWorked.data.yearsPassed : ''
        daysVacations = yearsWorked.data.vacationSetting?.vacationSettingVacationDays
          ? yearsWorked.data.vacationSetting?.vacationSettingVacationDays
          : 0
        daysUsed = yearsWorked.data.vacationUsedList ? yearsWorked.data.vacationUsedList.length : 0
      }
      const newRow = {
        company: '',
        employeeCode: employee.employeeCode.toString(),
        employeeName: `${employee.employeeFirstName} ${employee.employeeLastName}`,
        position: employee.position.positionName,
        employeeHireDate: employee.employeeHireDate
          ? this.getDate(employee.employeeHireDate.toString())
          : '',
        employerCompany: '',
        years: yearsPassed,
        daysVacations: daysVacations,
        daysUsed: daysUsed,
        daysRest: daysVacations - daysUsed,
      } as EmployeeVacationExcelRowInterface
      rows.push(newRow)
    }
    return rows
  }

  async addRowToWorkSheet(rows: EmployeeVacationExcelRowInterface[], worksheet: ExcelJS.Worksheet) {
    let rowCount = 5
    for await (const rowData of rows) {
      worksheet.addRow([
        rowData.company,
        rowData.employeeCode,
        rowData.employeeName,
        rowData.position,
        rowData.employeeHireDate,
        rowData.employerCompany,
        rowData.years,
        rowData.daysVacations,
        rowData.daysUsed,
        rowData.daysRest,
      ])
      rowCount += 1
    }
  }
  getDate(date: string) {
    return DateTime.fromISO(date).toFormat('yyyy-MM-dd')
  }
}
