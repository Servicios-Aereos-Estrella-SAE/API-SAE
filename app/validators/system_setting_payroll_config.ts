import vine from '@vinejs/vine'

export const createSystemSettingPayrollConfigValidator = vine.compile(
  vine.object({
    systemSettingPayrollConfigPaymentType: vine.string().trim(),
    systemSettingPayrollConfigFixedDay: vine.string().trim().optional(),
    systemSettingPayrollConfigFixedEveryNWeeks: vine.number().min(1).optional(),
    systemSettingPayrollConfigNumberOfDaysToBePaid: vine.number().min(1).optional(),
    systemSettingPayrollConfigNumberOfOverdueDaysToOffset: vine.number().min(1).optional(),
    systemSettingId: vine.number().min(1),
  })
)

export const updateSystemSettingPayrollConfigValidator = vine.compile(
  vine.object({
    systemSettingPayrollConfigPaymentType: vine.string().trim(),
    systemSettingPayrollConfigFixedDay: vine.string().trim().optional(),
    systemSettingPayrollConfigFixedEveryNWeeks: vine.number().min(1).optional(),
    systemSettingPayrollConfigNumberOfDaysToBePaid: vine.number().min(1).optional(),
    systemSettingPayrollConfigNumberOfOverdueDaysToOffset: vine.number().min(1).optional(),
    systemSettingId: vine.number().min(1),
  })
)
