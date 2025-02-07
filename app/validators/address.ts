import vine from '@vinejs/vine'

export const createAddressValidator = vine.compile(
  vine.object({
    addressZipcode: vine.number(),
    addressCountry: vine.string().trim().minLength(1).maxLength(50),
    addressState: vine.string().trim().minLength(1).maxLength(50),
    addressTownship: vine.string().trim().minLength(1).maxLength(50),
    addressCity: vine.string().trim().minLength(1).maxLength(50),
    addressSettlement: vine.string().trim().minLength(1).maxLength(50),
    addressSettlementType: vine.string().trim().minLength(1).maxLength(50).optional(),
    addressStreet: vine.string().trim().minLength(1).maxLength(65),
    addressInternalNumber: vine.string().trim().minLength(1).maxLength(10).optional(),
    addressExternalNumber: vine.string().trim().minLength(1).maxLength(10).optional(),
    addressBetweenStreet1: vine.string().trim().minLength(1).maxLength(50).optional(),
    addressBetweenStreet2: vine.string().trim().minLength(1).maxLength(50).optional(),
    addressTypeId: vine.number().min(1),
  })
)

export const updateAddressValidator = vine.compile(
  vine.object({
    addressZipcode: vine.number(),
    addressCountry: vine.string().trim().minLength(1).maxLength(50),
    addressState: vine.string().trim().minLength(1).maxLength(50),
    addressTownship: vine.string().trim().minLength(1).maxLength(50),
    addressCity: vine.string().trim().minLength(1).maxLength(50),
    addressSettlement: vine.string().trim().minLength(1).maxLength(50),
    addressSettlementType: vine.string().trim().minLength(1).maxLength(50).optional(),
    addressStreet: vine.string().trim().minLength(1).maxLength(65),
    addressInternalNumber: vine.string().trim().minLength(1).maxLength(10).optional(),
    addressExternalNumber: vine.string().trim().minLength(1).maxLength(10).optional(),
    addressBetweenStreet1: vine.string().trim().minLength(1).maxLength(50).optional(),
    addressBetweenStreet2: vine.string().trim().minLength(1).maxLength(50).optional(),
    addressTypeId: vine.number().min(1),
  })
)
