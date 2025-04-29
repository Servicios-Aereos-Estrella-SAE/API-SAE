import vine from '@vinejs/vine'

export const createdUserResponsibleEmployeeValidator = vine.compile(
  vine.object({
    userId: vine.number().min(1),
    employeeId: vine.number().min(1),
  })
)
