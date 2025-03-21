import ProceedingFileType from '#models/proceeding_file_type'
import vine from '@vinejs/vine'

export const createProceedingFileValidator = vine.compile(
  vine.object({
    proceedingFileName: vine.string().trim().minLength(0).maxLength(100).optional(),
    proceedingFileTypeId: vine.number().exists(async (_db, value) => {
      const proceedingFileType = await ProceedingFileType.query()
        .whereNull('deletedAt')
        .where('proceedingFileTypeId', value)
        .first()
      return !!proceedingFileType
    }),
  })
)

export const updateProceedingFileValidator = vine.compile(
  vine.object({
    proceedingFileName: vine.string().trim().minLength(0).maxLength(100).optional(),
    proceedingFileTypeId: vine.number().exists(async (_db, value) => {
      const proceedingFileType = await ProceedingFileType.query()
        .whereNull('deletedAt')
        .where('proceedingFileTypeId', value)
        .first()
      return !!proceedingFileType
    }),
  })
)
