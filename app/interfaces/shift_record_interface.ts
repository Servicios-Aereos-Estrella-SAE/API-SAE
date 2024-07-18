import { DateTime } from 'luxon'
import { ShiftInterface } from './shift_interface.js'

interface ShiftRecordInterface {
  shiftId: number
  shiftDate: DateTime
  employeeShiftId: number
  employeShiftsApplySince: Date | string
  employeeId: number
  shift: ShiftInterface
}

export type { ShiftRecordInterface }
