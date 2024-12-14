import { DateTime } from 'luxon'

interface ShiftExceptionErrorInterface {
  shiftExceptionsDate: string | null | DateTime
  error: string
}

export type { ShiftExceptionErrorInterface }
