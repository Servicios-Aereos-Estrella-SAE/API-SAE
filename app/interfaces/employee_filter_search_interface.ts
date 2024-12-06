interface EmployeeFilterSearchInterface {
  search: string
  page: number
  limit: number
  departmentId: number
  positionId: number
  employeeWorkSchedule: string
  employeeTypeId: number
  ignoreDiscriminated?: number
  onlyInactive?: boolean | string
}

export type { EmployeeFilterSearchInterface }
