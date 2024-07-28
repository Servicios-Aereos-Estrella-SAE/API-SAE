import VacationSetting from '#models/vacation_setting'
import vine from '@vinejs/vine'

export const createVacationSettingValidator = vine.compile(
  vine.object({
    yearsOfService: vine
      .number()
      .min(1)
      .max(50)
      .unique(async (_db, value) => {
        const existingSetting = await VacationSetting.query()
          .where('years_of_service', value)
          .whereNull('deleted_at')
          .first()

        if (existingSetting) {
          return false
        }
        return true
      }),
    vacationDays: vine.number().min(1).max(30),
  })
)

export const updateVacationSettingValidator = vine.compile(
  vine.object({
    yearsOfService: vine.number().min(1).max(50),
    vacationDays: vine.number().min(1).max(30),
  })
)
