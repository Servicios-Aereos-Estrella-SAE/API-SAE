import vine from '@vinejs/vine'

export const createSystemSettingSystemModuleValidator = vine.compile(
  vine.object({
    systemSettingId: vine.number().min(1),
    systemModuleId: vine.number().min(1),
  })
)

export const updateSystemSettingSystemModuleValidator = vine.compile(
  vine.object({
    systemSettingId: vine.number().min(1),
    systemModuleId: vine.number().min(1),
  })
)
