import Employee from '#models/employee'
interface DepartmentShiftEmployeeWarningInterface {
  status: number
  type: string
  title: string
  message: string
  employee: Employee
}
export type { DepartmentShiftEmployeeWarningInterface }
