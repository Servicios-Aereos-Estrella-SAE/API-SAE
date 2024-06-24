import { DateTime } from 'luxon'

export default interface DataAssistsDto {
  id: number
  emp_code: string
  terminal_sn: string
  terminal_alias: string
  area_alias: string
  longitude: number
  latitude: number
  upload_time: DateTime
  emp_id: number
  terminal_id: number
  punch_time: DateTime
  punch_time_local: DateTime
  punch_time_origin: DateTime
}
