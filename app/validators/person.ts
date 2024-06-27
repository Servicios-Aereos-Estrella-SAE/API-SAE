import Person from '#models/person'
import vine from '@vinejs/vine'

export const createPersonValidator = vine.compile(
  vine.object({
    personFirstname: vine.string().trim().minLength(1).maxLength(150),
    personLastname: vine.string().trim().minLength(0).maxLength(150),
    personSecondLastname: vine.string().trim().minLength(0).maxLength(150),
    personPhone: vine.string().trim().minLength(0).maxLength(45).optional(),
    personGender: vine.string().trim().minLength(0).maxLength(10).optional(),
    personBirthday: vine
      .date({
        formats: ['YYYY-MM-DD', 'x'],
      })
      .optional(),
    personCurp: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(45)
      .unique(async (_db, value) => {
        const existingCurp = await Person.query()
          .where('person_curp', value)
          .whereNull('person_deleted_at')
          .first()
        return !existingCurp
      })
      .optional(),
    personRfc: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(45)
      .unique(async (_db, value) => {
        const existingRfc = await Person.query()
          .where('person_rfc', value)
          .whereNull('person_deleted_at')
          .first()
        return !existingRfc
      })
      .optional(),
    personImssNss: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(45)
      .unique(async (_db, value) => {
        const existingImssNss = await Person.query()
          .where('person_imss_nss', value)
          .whereNull('person_deleted_at')
          .first()
        return !existingImssNss
      })
      .optional(),
  })
)

export const updatePersonValidator = vine.compile(
  vine.object({
    personFirstname: vine.string().trim().minLength(1).maxLength(150),
    personLastname: vine.string().trim().minLength(0).maxLength(150),
    personSecondLastname: vine.string().trim().minLength(0).maxLength(150),
    personPhone: vine.string().trim().minLength(0).maxLength(45).optional(),
    personGender: vine.string().trim().minLength(0).maxLength(10).optional(),
    personBirthday: vine
      .date({
        formats: ['YYYY-MM-DD', 'x'],
      })
      .optional(),
    personCurp: vine.string().trim().minLength(0).maxLength(45).optional(),
    personRfc: vine.string().trim().minLength(0).maxLength(45).optional(),
    personImssNss: vine.string().trim().minLength(0).maxLength(45).optional(),
  })
)
