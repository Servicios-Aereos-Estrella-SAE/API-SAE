interface EmployeeFilterSearchInterface {
  search: string
  page: number
  limit: number
  departmentId: number
  positionId: number
  employeeWorkSchedule: string
  ignoreDiscriminated?: number
  onlyInactive?: boolean | string
}

export type { EmployeeFilterSearchInterface }
