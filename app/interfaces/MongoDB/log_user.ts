import User from '#models/user'
import { Actions } from './enum/actions.js'

interface LogUser {
  user_id: number
  action: Actions
  user_agent: string
  sec_ch_ua_platform: string
  sec_ch_ua: string
  origin: string
  date: string
  record_previous: User
  record_current: User
}
export type { LogUser }
