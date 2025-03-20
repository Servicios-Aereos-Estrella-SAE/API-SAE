import vine from '@vinejs/vine'

export const createEmployeeBankValidator = vine.compile(
  vine.object({
    employeeBankAccountClabe: vine.string().trim().minLength(1).maxLength(250),
    employeeBankAccountNumber: vine.string().trim().minLength(0).maxLength(250).optional(),
    employeeBankAccountCardNumber: vine.string().trim().minLength(0).maxLength(250).optional(),
    employeeBankAccountType: vine.string().trim().minLength(0).maxLength(50).optional(),
    employeeBankAccountCurrencyType: vine.string().trim().minLength(1).maxLength(3),
    employeeId: vine.number(),
    bankId: vine.number(),
  })
)

export const updateEmployeeBankValidator = vine.compile(
  vine.object({
    employeeBankAccountClabe: vine.string().trim().minLength(1).maxLength(250),
    employeeBankAccountNumber: vine.string().trim().minLength(0).maxLength(250).optional(),
    employeeBankAccountCardNumber: vine.string().trim().minLength(0).maxLength(250).optional(),
    employeeBankAccountType: vine.string().trim().minLength(0).maxLength(50).optional(),
    employeeBankAccountCurrencyType: vine.string().trim().minLength(1).maxLength(3),
  })
)
