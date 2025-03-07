import vine from '@vinejs/vine'

export const createEmployeeBankValidator = vine.compile(
  vine.object({
    employeeBankAccountClabeAccount: vine.string().trim().minLength(1).maxLength(250),
    employeeBankAccountClabeLastNumbers: vine.string().trim().minLength(1).maxLength(4),
    employeeBankAccountNumber: vine.string().trim().minLength(0).maxLength(250),
    employeeBankAccountNumberLastNumbers: vine.string().trim().minLength(1).maxLength(4),
    employeeBankAccountType: vine.string().trim().minLength(0).maxLength(50).optional(),
    employeeId: vine.number(),
    bankId: vine.number(),
  })
)

export const updateEmployeeBankValidator = vine.compile(
  vine.object({
    employeeBankAccountClabeAccount: vine.string().trim().minLength(1).maxLength(250),
    employeeBankAccountClabeLastNumbers: vine.string().trim().minLength(1).maxLength(4),
    employeeBankAccountNumber: vine.string().trim().minLength(0).maxLength(250),
    employeeBankAccountNumberLastNumbers: vine.string().trim().minLength(1).maxLength(4),
    employeeBankAccountType: vine.string().trim().minLength(0).maxLength(50).optional(),
  })
)
