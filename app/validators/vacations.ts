import VacationSetting from '#models/vacation_setting'
import vine from '@vinejs/vine'

export const createVacationSettingValidator = vine.compile(
  vine.object({
    vacationSettingYearsOfService: vine
      .number()
      .min(1)
      .max(50)
      .unique(async (_db, value) => {
        const existingSetting = await VacationSetting.query()
          .where('vacation_setting_years_of_service', value)
          .whereNull('deleted_at')
          .first()

        if (existingSetting) {
          return false
        }
        return true
      }),
    vacationSettingVacationDays: vine.number().min(1).max(30),
  })
)

export const updateVacationSettingValidator = vine.compile(
  vine.object({
    vacationSettingYearsOfService: vine.number().min(1).max(50),
    vacationSettingVacationDays: vine.number().min(1).max(30),
  })
)
