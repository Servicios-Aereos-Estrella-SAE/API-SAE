import vine from '@vinejs/vine'

export const createWorkDisabilityPeriodExpenseValidator = vine.compile(
  vine.object({
    workDisabilityPeriodExpenseAmount: vine.number(),
    workDisabilityPeriodId: vine.number().min(1),
  })
)
