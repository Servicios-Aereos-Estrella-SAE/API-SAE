import Employee from '#models/employee'
interface PositionShiftEmployeeWarningInterface {
  status: number
  type: string
  title: string
  message: string
  employee: Employee
}
export type { PositionShiftEmployeeWarningInterface }
