import { DateTime } from 'luxon'
import { AssistInterface } from './assist_interface.js'
import { ShiftInterface } from './shift_interface.js'
import { HolidayInterface } from './holiday_interface.js'

interface AssistDayInterface {
  day: string
  assist: {
    checkIn: AssistInterface | null
    checkOut: AssistInterface | null
    checkEatIn: AssistInterface | null
    checkEatOut: AssistInterface | null
    dateShift: ShiftInterface | null
    checkInDateTime: Date | DateTime | null
    checkOutDateTime: Date | DateTime | null
    checkInStatus: string
    checkOutStatus: string
    isFutureDay: boolean
    isSundayBonus: boolean
    isRestDay: boolean
    isVacationDate: boolean
    isHoliday: boolean
    holiday: HolidayInterface | null
  }
}

export type { AssistDayInterface }
