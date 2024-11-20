interface EmployeeVacationExcelFilterInterface {
  search: string
  employeeId: number
  departmentId: number
  positionId: number
  filterStartDate: string
  filterEndDate: string
  onlyInactive: boolean | string
}
export type { EmployeeVacationExcelFilterInterface }
