import vine from '@vinejs/vine'

export const createEmployeeRecordValidator = vine.compile(
  vine.object({
    employeeRecordPropertyId: vine.number().min(1),
    employeeId: vine.number().min(1),
    employeeRecordValue: vine.string().trim().minLength(1).optional(),
    employeeRecordActive: vine.boolean(),
  })
)

export const updateEmployeeRecordValidator = vine.compile(
  vine.object({
    employeeRecordValue: vine.string().trim().minLength(1).optional(),
    employeeRecordActive: vine.boolean(),
  })
)
