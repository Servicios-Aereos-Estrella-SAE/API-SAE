import Person from '#models/person'
import vine from '@vinejs/vine'

export const createPersonValidator = vine.compile(
  vine.object({
    personFirstname: vine.string().trim().minLength(1).maxLength(150),
    personLastname: vine.string().trim().minLength(0).maxLength(150),
    personSecondLastname: vine.string().trim().minLength(0).maxLength(150),
    personPhone: vine.string().trim().minLength(0).maxLength(45).optional(),
    personEmail: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(200)
      .unique(async (_db, value) => {
        const existingEmail = await Person.query()
          .whereNull('person_deleted_at')
          .where('person_email', value)
          .first()
        return !existingEmail
      })
      .optional(),
    personGender: vine.string().trim().minLength(0).maxLength(10).optional(),
    personCurp: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(45)
      .unique(async (_db, value) => {
        const existingCurp = await Person.query()
          .where('person_curp', value)
          .whereNotNull('person_curp')
          .whereNull('person_deleted_at')
          .whereNot('person_curp', '')
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
          .whereNotNull('person_rfc')
          .whereNot('person_rfc', '')
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
          .whereNotNull('person_imss_nss')
          .whereNot('person_imss_nss', '')
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
    personEmail: vine.string().trim().minLength(0).maxLength(200),
    personGender: vine.string().trim().minLength(0).maxLength(10).optional(),
    personCurp: vine.string().trim().minLength(0).maxLength(45).optional(),
    personRfc: vine.string().trim().minLength(0).maxLength(45).optional(),
    personImssNss: vine.string().trim().minLength(0).maxLength(45).optional(),
  })
)
