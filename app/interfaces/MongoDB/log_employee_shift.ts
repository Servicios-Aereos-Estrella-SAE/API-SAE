import EmployeeShift from '#models/employee_shift'
import { Actions } from './enum/actions.js'

interface LogEmployeeShift {
  user_id: number
  action: Actions // este es el enum
  user_agent: string
  sec_ch_ua_platform: string
  sec_ch_ua: string
  date: string
  record_previous: EmployeeShift
  record_current: EmployeeShift
}
export type { LogEmployeeShift }
