import { DateTime } from 'luxon'

interface ShiftInterface {
  shiftId: number | null
  shiftName: string
  shiftCalculateFlag?: string | null
  shiftDayStart: number
  shiftTimeStart: string
  shiftActiveHours: number
  shiftRestDays: string
  shiftCreatedAt: Date | DateTime | string | null
  shiftUpdatedAt: Date | DateTime | string | null
  shiftDeletedAt?: Date | DateTime | string | null
}

export type { ShiftInterface }
