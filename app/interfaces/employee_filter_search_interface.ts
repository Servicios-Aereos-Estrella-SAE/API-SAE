interface EmployeeFilterSearchInterface {
  search: string
  page: number
  limit: number
  departmentId: number
  positionId: number
  employeeWorkSchedule: string
  employeeTypeId?: number
  ignoreDiscriminated?: number
  ignoreExternal?: number
  onlyInactive?: boolean | string
  year?: number
}

export type { EmployeeFilterSearchInterface }
