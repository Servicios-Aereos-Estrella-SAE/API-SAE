import Employee from '#models/employee'
import ExceptionType from '#models/exception_type'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

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
    shiftExceptionsDate: vine.string().transform((value) => DateTime.fromISO(value)),
    shiftExceptionsDescription: vine.string(),
  })
)
