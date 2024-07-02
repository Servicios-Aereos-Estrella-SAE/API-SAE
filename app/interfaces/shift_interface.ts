interface ShiftInterface {
  shiftId: number | null
  shiftName: string
  shiftDayStart: number
  shiftTimeStart: string
  shiftActiveHours: number
  shiftRestDays: string
  shiftCreatedAt: Date | string | null
  shiftUpdatedAt: Date | string | null
  shiftDeletedAt: Date | string | null
}

export type { ShiftInterface }
