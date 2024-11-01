import ExceptionRequest from '#models/exception_request'
import vine from '@vinejs/vine'

export const storeExceptionRequestValidator = vine.compile(
  vine.object({
    employeeId: vine
      .number()
      .min(1)
      .unique(async (_db, value) => {
        const existingEmployee = await ExceptionRequest.query().where('employee_id', value).first()
        return !existingEmployee
      }),
    exceptionTypeId: vine
      .number()
      .min(1)
      .unique(async (_db, value) => {
        const existingType = await ExceptionRequest.query()
          .where('exception_type_id', value)
          .first()
        return !existingType
      }),
    exceptionRequestStatus: vine.enum(['requested', 'pending', 'accepted', 'refused']),
    exceptionRequestDescription: vine.string().trim().maxLength(255).optional(),
  })
)

export const updateExceptionRequestValidator = vine.compile(
  vine.object({
    exceptionRequestStatus: vine.enum(['requested', 'pending', 'accepted', 'refused']).optional(),
    exceptionRequestDescription: vine.string().trim().maxLength(255).optional(),
  })
)
