import vine from '@vinejs/vine'

export const createEmployeeProceedingFileValidator = vine.compile(
  vine.object({
    employeeId: vine.number().min(1),
    proceedingFileId: vine.number().min(1),
  })
)

export const updateEmployeeProceedingFileValidator = vine.compile(
  vine.object({
    employeeId: vine.number().min(1),
    proceedingFileId: vine.number().min(1),
  })
)
