import { DateTime } from 'luxon'
import { LogStore } from '#models/MongoDB/log_store'
import { LogRequest } from '../../interfaces/MongoDB/log_request.js'

export default class LogService {
  createActionLog(rawHeaders: string[], action: string) {
    const date = DateTime.local().setZone('utc').toISO()
    const userAgent = this.getHeaderValue(rawHeaders, 'User-Agent')
    const secChUaPlatform = this.getHeaderValue(rawHeaders, 'sec-ch-ua-platform')
    const secChUa = this.getHeaderValue(rawHeaders, 'sec-ch-ua')
    const origin = this.getHeaderValue(rawHeaders, 'Origin')
    const logEmployeeShift = {
      user_id: 0,
      action: action,
      user_agent: userAgent,
      sec_ch_ua_platform: secChUaPlatform,
      sec_ch_ua: secChUa,
      origin: origin,
      date: date ? date : '',
      route: '',
    } as LogRequest
    return logEmployeeShift
  }

  async saveActionOnLog(logRequest: LogRequest) {
    try {
      await LogStore.set('log_request', logRequest)
    } catch (err) {}
  }

  getHeaderValue(headers: Array<string>, headerName: string) {
    const index = headers.indexOf(headerName)
    return index !== -1 ? headers[index + 1] : null
  }
}
