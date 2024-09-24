import ProceedingFileType from '#models/proceeding_file_type'
import vine from '@vinejs/vine'

export const createProceedingFileTypeValidator = vine.compile(
  vine.object({
    proceedingFileTypeName: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(100)
      .unique(async (_db, value) => {
        const existingName = await ProceedingFileType.query()
          .where('proceedingFileTypeName', value)
          .whereNull('proceedingFileTypeDeletedAt')
          .first()
        return !existingName
      }),
    proceedingFileTypeIcon: vine.string().trim().optional(),
    proceedingFileTypeSlug: vine.string().trim().minLength(1).maxLength(250),
    proceedingFileTypeAreaToUse: vine.string().trim().minLength(1).maxLength(100),
    proceedingFileTypeActive: vine.boolean().optional(),
  })
)

export const updateProceedingFileTypeValidator = vine.compile(
  vine.object({
    proceedingFileTypeName: vine.string().trim().minLength(1).maxLength(100),
    proceedingFileTypeIcon: vine.string().trim().optional(),
    proceedingFileTypeSlug: vine.string().trim().minLength(1).maxLength(250),
    proceedingFileTypeAreaToUse: vine.string().trim().minLength(1).maxLength(100),
    proceedingFileTypeActive: vine.boolean().optional(),
  })
)