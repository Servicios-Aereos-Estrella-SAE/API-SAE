import { DateTime } from 'luxon'
import { AssistInterface } from './assist_interface.js'
import { ShiftInterface } from './shift_interface.js'

interface AssistDayInterface {
  day: string
  assist: {
    checkIn: AssistInterface | null
    checkOut: AssistInterface | null
    dateShift: ShiftInterface | null
    checkIntDateTime: Date | DateTime | null
    checkOutDateTime: Date | DateTime | null
    checkInStatus: string
    checkOutStatus: string
    isFutureDay: boolean
    isSundayBonus: boolean
    isRestDay: boolean
    isVacationDate: boolean
    isHoliday: boolean
  }
}

export type { AssistDayInterface }
