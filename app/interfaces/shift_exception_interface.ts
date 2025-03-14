import { DateTime } from 'luxon'
import { ShiftExceptionType } from './shift_exception_type_interface.js'

interface ShiftExceptionInterface {
  shiftExceptionId: number | null
  employeeId: number | null
  exceptionTypeId: number | null
  shiftExceptionsDescription: string
  shiftExceptionsDate: string | null | DateTime
  shiftExceptionCheckInTime: string | null
  shiftExceptionCheckOutTime: string | null
  shiftExceptionEnjoymentOfSalary: number | null
  shiftExceptionsCreatedAt: Date | string | null
  shiftExceptionsUpdatedAt: Date | string | null
  shiftExceptionsDeletedAt: Date | string | null
  exceptionType?: ShiftExceptionType
}

export type { ShiftExceptionInterface }
