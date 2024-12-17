import { DateTime } from 'luxon'

interface ExceptionRequestErrorInterface {
  requestedDate: string | null | DateTime
  error: string
}

export type { ExceptionRequestErrorInterface }
