import vine from '@vinejs/vine'

export const createProceedingFileTypeEmailValidator = vine.compile(
  vine.object({
    proceedingFileTypeId: vine.number().min(1),
    proceedingFileTypeEmailEmail: vine.string().trim().minLength(0).maxLength(200),
  })
)

export const updateProceedingFileTypeEmailValidator = vine.compile(
  vine.object({
    proceedingFileTypeId: vine.number().min(1),
    proceedingFileTypeEmailEmail: vine.string().trim().minLength(0).maxLength(200),
  })
)
