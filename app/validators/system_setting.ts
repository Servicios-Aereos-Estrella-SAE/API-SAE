import vine from '@vinejs/vine'

export const createSystemSettingValidator = vine.compile(
  vine.object({
    systemSettingSidebarColor: vine.string().trim().minLength(1).maxLength(25),
    systemSettingTradeName: vine.string().trim().minLength(1).maxLength(150),
  })
)

export const updateSystemSettingValidator = vine.compile(
  vine.object({
    systemSettingSidebarColor: vine.string().trim().minLength(1).maxLength(25),
    systemSettingTradeName: vine.string().trim().minLength(1).maxLength(150),
  })
)
