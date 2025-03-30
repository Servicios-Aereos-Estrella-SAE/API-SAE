import Position from '#models/position'
import vine from '@vinejs/vine'

export const createPositionValidator = vine.compile(
  vine.object({
    positionCode: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(50)
      .unique(async (_db, value) => {
        const existingCode = await Position.query()
          .where('position_code', value)
          .whereNull('position_deleted_at')
          .first()
        return !existingCode
      }),
    positionName: vine.string().trim().minLength(1).maxLength(100),
    positionAlias: vine.string().trim().minLength(0).maxLength(250).optional(),
    positionIsDefault: vine.boolean().optional(),
    positionActive: vine.boolean().optional(),
    parentPositionId: vine.number().min(0).optional(),
  })
)

export const updatePositionValidator = vine.compile(
  vine.object({
    positionCode: vine.string().trim().minLength(1).maxLength(50),
    positionName: vine.string().trim().minLength(1).maxLength(100),
    positionAlias: vine.string().trim().minLength(0).maxLength(250).optional(),
    positionIsDefault: vine.boolean().optional(),
    positionActive: vine.boolean().optional(),
    parentPositionId: vine.number().min(0).optional(),
  })
)
