import User from '#models/user'
import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    userEmail: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(200)
      .unique(async (_db, value) => {
        const existingEmail = await User.query()
          .whereNull('user_deleted_at')
          .where('user_email', value)
          .first()
        return !existingEmail
      }),
    userPassword: vine.string().trim().minLength(1).maxLength(255),
    userActive: vine.boolean(),
    roleId: vine.number().min(1),
    personId: vine
      .number()
      .min(1)
      .unique(async (_db, value) => {
        const existingPersonId = await User.query()
          .where('person_id', value)
          .whereNull('user_deleted_at')
          .first()
        return !existingPersonId
      }),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    userEmail: vine.string().trim().minLength(0).maxLength(200),
    userPassword: vine.string().trim().minLength(1).maxLength(255).optional(),
    userActive: vine.boolean(),
    roleId: vine.number().min(1),
  })
)
