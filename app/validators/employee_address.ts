import vine from '@vinejs/vine'

export const createEmployeeAddressValidator = vine.compile(
  vine.object({
    employeeId: vine.number().min(1),
    addressId: vine.number().min(1),
  })
)

export const updateEmployeeAddressValidator = vine.compile(
  vine.object({
    employeeId: vine.number().min(1),
    addressId: vine.number().min(1),
  })
)
