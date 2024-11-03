import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { DateTime } from 'luxon'
import { LogStore } from '#models/MongoDB/log_store'
import { LogRequest } from '../interfaces/MongoDB/log_request.js'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    const rawHeaders = ctx.request.request.rawHeaders
    const userAgent = this.getHeaderValue(rawHeaders, 'User-Agent')
    const secChUaPlatform = this.getHeaderValue(rawHeaders, 'sec-ch-ua-platform')
    const secChUa = this.getHeaderValue(rawHeaders, 'sec-ch-ua')
    try {
      const date = DateTime.local().setZone('utc').toISO()
      const userId = ctx.auth.user?.userId
      const route = ctx.request.response.req.url
      if (userId && route) {
        await LogStore.set('log_request', {
          user_id: userId,
          route: route,
          user_agent: userAgent,
          sec_ch_ua_platform: secChUaPlatform,
          sec_ch_ua: secChUa,
          date: date ? date : '',
        } as LogRequest)
      }
    } catch (err) {}
    return next()
  }

  getHeaderValue(headers: Array<string>, headerName: string) {
    const index = headers.indexOf(headerName)
    return index !== -1 ? headers[index + 1] : null
  }
}
