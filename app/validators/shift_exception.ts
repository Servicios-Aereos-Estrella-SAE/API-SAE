import Employee from '#models/employee'
import ExceptionType from '#models/exception_type'
import vine from '@vinejs/vine'

export const createShiftExceptionValidator = vine.compile(
  vine.object({
    employeeId: vine.number().exists(async (_db, value) => {
      const existingEmployee = await Employee.query().where('employeeId', value).first()
      return !!existingEmployee
    }),
    exceptionTypeId: vine.number().exists(async (_db, value) => {
      const existingExceptionType = await ExceptionType.query()
        .where('exceptionTypeId', value)
        .first()
      return !!existingExceptionType
    }),
    shiftExceptionsDescription: vine.string(),
  })
)
