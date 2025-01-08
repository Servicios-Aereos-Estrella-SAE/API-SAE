import vine from '@vinejs/vine'

export const createWorkDisabilityPeriodValidator = vine.compile(
  vine.object({
    workDisabilityPeriodStartDate: vine.string().trim().maxLength(10).optional(),
    workDisabilityPeriodEndDate: vine.string().trim().maxLength(10).optional(),
    workDisabilityPeriodTicketFolio: vine.string().trim().maxLength(100),
    workDisabilityId: vine.number().min(1),
    workDisabilityTypeId: vine.number().min(1),
  })
)
