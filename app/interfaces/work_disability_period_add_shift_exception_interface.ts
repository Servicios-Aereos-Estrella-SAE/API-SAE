import WorkDisabilityPeriod from '#models/work_disability_period'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'

interface WorkDisabilityPeriodAddShiftExceptionInterface {
  workDisabilityPeriod: WorkDisabilityPeriod
  auth: Authenticator<Authenticators>
  request: Request | any
}

export type { WorkDisabilityPeriodAddShiftExceptionInterface }
