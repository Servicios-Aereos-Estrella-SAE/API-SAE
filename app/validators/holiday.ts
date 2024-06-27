// validators/holiday.ts
import vine from '@vinejs/vine'

export const createOrUpdateHolidayValidator = vine.compile(
  vine.object({
    holidayName: vine.string().trim().minLength(0),
    holidayDate: vine
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/),
    holidayIcon: vine.string().optional(),
  })
)
