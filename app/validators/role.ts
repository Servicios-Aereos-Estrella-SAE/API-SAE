import vine from '@vinejs/vine'

export const createRoleValidator = vine.compile(
  vine.object({
    roleName: vine.string().trim().minLength(1).maxLength(100),
    roleDescription: vine.string().trim().minLength(0).maxLength(200).optional(),
    roleActive: vine.boolean().optional(),
  })
)

export const updateRoleValidator = vine.compile(
  vine.object({
    roleName: vine.string().trim().minLength(1).maxLength(100),
    roleDescription: vine.string().trim().minLength(0).maxLength(200).optional(),
    roleActive: vine.boolean().optional(),
  })
)
