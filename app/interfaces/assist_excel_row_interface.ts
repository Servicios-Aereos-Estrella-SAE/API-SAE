import { ShiftExceptionInterface } from './shift_exception_interface.js'

interface AssistExcelRowInterface {
  code: string
  name: string
  department: string
  position: string
  date: string
  shiftAssigned: string
  shiftStartDate: string
  shiftEndsDate: string
  checkInTime: string
  firstCheck: string
  lunchTime: string
  returnLunchTime: string
  checkOutTime: string
  lastCheck: string
  incidents: string
  notes: string
  sundayPremium: string
  checkOutStatus: string
  exceptions: ShiftExceptionInterface[]
}
export type { AssistExcelRowInterface }
