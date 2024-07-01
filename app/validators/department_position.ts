import vine from '@vinejs/vine'

export const createDepartmentPositionValidator = vine.compile(
  vine.object({
    departmentId: vine.number().min(1),
    positionId: vine.number().min(1),
  })
)

export const updateDepartmentPositionValidator = vine.compile(
  vine.object({
    departmentId: vine.number().min(1),
    positionId: vine.number().min(1),
  })
)
