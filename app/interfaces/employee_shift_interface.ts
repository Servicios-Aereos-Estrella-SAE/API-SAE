import { ShiftInterface } from './shift_interface.js'

interface EmployeeShiftInterface {
  employeeShiftId: number | null
  employeeId: number | null
  shiftId: number | null
  employeShiftsApplySince: string | Date | null
  employeShiftsCreatedAt: string | Date | null
  employeShiftsUpdatedAt: string | Date | null
  employeShiftsDeletedAt: string | Date | null
  shift: ShiftInterface
}

export type { EmployeeShiftInterface }
