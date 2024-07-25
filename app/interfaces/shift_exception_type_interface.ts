import { DateTime } from 'luxon'

interface ShiftExceptionType {
  exceptionTypeId: number
  exceptionTypeTypeName: string
  exceptionTypeIcon: string
  exceptionTypeSlug: string
  exceptionTypeCreatedAt: DateTime
  exceptionTypeUpdatedAt: DateTime
  exceptionTypeDeletedAt: DateTime
}

export type { ShiftExceptionType }
