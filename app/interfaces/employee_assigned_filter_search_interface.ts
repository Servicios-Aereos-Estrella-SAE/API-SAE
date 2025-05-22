interface EmployeeAssignedFilterSearchInterface {
  search: string
  departmentId: number
  positionId: number
  userId: number
  employeeId: number
  userResponsibleId?: number
}

export type { EmployeeAssignedFilterSearchInterface }
