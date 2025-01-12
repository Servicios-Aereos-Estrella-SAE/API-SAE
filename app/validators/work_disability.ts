import vine from '@vinejs/vine'

export const createWorkDisabilityValidator = vine.compile(
  vine.object({
    employeeId: vine.number().min(1),
    insuranceCoverageTypeId: vine.number().min(1),
  })
)
