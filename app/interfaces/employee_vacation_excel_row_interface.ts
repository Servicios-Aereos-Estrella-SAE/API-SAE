interface EmployeeVacationExcelRowInterface {
  employeeCode: string
  employeeName: string
  department: string
  position: string
  employeeHireDate: string
  employerCompany: string
  years: number
  daysVacations: number
  daysUsed: number
  daysRest: number
  vacationsUsed: Array<string>
}
export type { EmployeeVacationExcelRowInterface }
