interface EmployeeFilterSearchInterface {
  search: string
  page: number
  limit: number
  departmentId: number
  positionId: number
  employeeWorkSchedule: string
  ignoreDiscriminated?: number
}

export type { EmployeeFilterSearchInterface }
