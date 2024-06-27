import Shift from '#models/shift'
import vine from '@vinejs/vine'

export const createShiftValidator = vine.compile(
  vine.object({
    shiftName: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(255)
      .unique(async (_db, value) => {
        const existingShift = await Shift.query()
          .where('shift_name', value)
          .whereNull('shiftDeletedAt')
          .first()
        return !existingShift
      }),
    shiftDayStart: vine.number().min(0).max(6),
    shiftTimeStart: vine.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    shiftActiveHours: vine.number().min(1).max(72),
    shiftRestDays: vine.string().regex(/^([0-6](,[0-6])*)?$/),
  })
)

export const updateShiftValidator = (id: any) =>
  vine.compile(
    vine.object({
      shiftName: vine
        .string()
        .trim()
        .minLength(1)
        .maxLength(255)
        .unique(async (_db, value) => {
          const existingShift = await Shift.query()
            .where('shift_name', value)
            .whereNot('shift_id', id)
            .whereNull('shiftDeletedAt')
            .first()
          return !existingShift
        }),
      shiftDayStart: vine.number().min(0).max(6),
      shiftTimeStart: vine.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      shiftActiveHours: vine.number().min(1).max(72),
      shiftRestDays: vine.string().regex(/^([0-6](,[0-6])*)?$/),
    })
  )
