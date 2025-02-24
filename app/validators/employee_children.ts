import vine from '@vinejs/vine'

export const createEmployeeChildrenValidator = vine.compile(
  vine.object({
    employeeChildrenFirstname: vine.string().trim().minLength(1).maxLength(150),
    employeeChildrenLastname: vine.string().trim().minLength(0).maxLength(150),
    employeeChildrenSecondLastname: vine.string().trim().minLength(0).maxLength(150),
    employeeChildrenGender: vine.string().trim().minLength(0).maxLength(10).optional(),
    employeeId: vine.number(),
  })
)

export const updateEmployeeChildrenValidator = vine.compile(
  vine.object({
    employeeChildrenFirstname: vine.string().trim().minLength(1).maxLength(150),
    employeeChildrenLastname: vine.string().trim().minLength(0).maxLength(150),
    employeeChildrenSecondLastname: vine.string().trim().minLength(0).maxLength(150),
    employeeChildrenPhone: vine.string().trim().minLength(0).maxLength(45).optional(),
    employeeChildrenGender: vine.string().trim().minLength(0).maxLength(10).optional(),
  })
)
