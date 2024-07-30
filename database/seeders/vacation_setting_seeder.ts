import { BaseSeeder } from '@adonisjs/lucid/seeders'
import VacationSetting from '../../app/models/vacation_setting.js'

export default class VacationSettingSeeder extends BaseSeeder {
  async run() {
    const vacationSettings = [
      { vacationSettingYearsOfService: 1, vacationSettingVacationDays: 12 },
      { vacationSettingYearsOfService: 2, vacationSettingVacationDays: 14 },
      { vacationSettingYearsOfService: 3, vacationSettingVacationDays: 16 },
      { vacationSettingYearsOfService: 4, vacationSettingVacationDays: 18 },
      { vacationSettingYearsOfService: 5, vacationSettingVacationDays: 20 },
      { vacationSettingYearsOfService: 6, vacationSettingVacationDays: 22 },
      { vacationSettingYearsOfService: 7, vacationSettingVacationDays: 22 },
      { vacationSettingYearsOfService: 8, vacationSettingVacationDays: 22 },
      { vacationSettingYearsOfService: 9, vacationSettingVacationDays: 22 },
      { vacationSettingYearsOfService: 10, vacationSettingVacationDays: 22 },
    ]

    for (const setting of vacationSettings) {
      await VacationSetting.updateOrCreate(
        { vacationSettingYearsOfService: setting.vacationSettingYearsOfService },
        { vacationSettingVacationDays: setting.vacationSettingVacationDays }
      )
    }
  }
}
