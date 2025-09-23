import vine from '@vinejs/vine'

export const createSystemSettingPayrollConfigValidator = vine.compile(
  vine.object({
    systemSettingPayrollConfigPaymentType: vine.string().trim(),
    systemSettingPayrollConfigNumberOfDaysToBePaid: vine.number().min(1),
    systemSettingPayrollConfigNumberOfOverdueDaysToOffset: vine.number().min(1),
    systemSettingId: vine.number().min(1),
  })
)

export const updateSystemSettingPayrollConfigValidator = vine.compile(
  vine.object({
    systemSettingPayrollConfigPaymentType: vine.string().trim(),
    systemSettingPayrollConfigNumberOfDaysToBePaid: vine.number().min(1),
    systemSettingPayrollConfigNumberOfOverdueDaysToOffset: vine.number().min(1),
    systemSettingId: vine.number().min(1),
  })
)
