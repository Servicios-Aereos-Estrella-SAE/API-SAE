import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const storeExceptionRequestValidator = vine.compile(
  vine.object({
    employeeId: vine.number().min(1),
    exceptionTypeId: vine.number().min(1),
    exceptionRequestStatus: vine.enum(['requested', 'pending', 'accepted', 'refused']),
    exceptionRequestDescription: vine.string().trim().maxLength(255).optional(),
    requestedDate: vine.date().transform((value) => DateTime.fromJSDate(value)),
  })
)

export const updateExceptionRequestValidator = vine.compile(
  vine.object({
    exceptionRequestStatus: vine.enum(['requested', 'pending', 'accepted', 'refused']).optional(),
    exceptionRequestDescription: vine.string().trim().maxLength(255).optional(),
    requestedDate: vine.date().transform((value) => DateTime.fromJSDate(value)),
  })
)
