import { ShiftInterface } from './shift_interface.js'

interface ShiftRecordInterface {
  shiftId: number
  shiftDate: any
  employeeShiftId: any
  employeShiftsApplySince: any
  employeeId: any
  shift: ShiftInterface
}

export type { ShiftRecordInterface }
