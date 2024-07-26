import { BaseSeeder } from '@adonisjs/lucid/seeders'
import VacationSetting from '../../app/models/vacation_setting.js'

export default class VacationSettingSeeder extends BaseSeeder {
  async run() {
    const vacationSettings = [
      { yearsOfService: 1, vacationDays: 12 },
      { yearsOfService: 2, vacationDays: 14 },
      { yearsOfService: 3, vacationDays: 16 },
      { yearsOfService: 4, vacationDays: 18 },
      { yearsOfService: 5, vacationDays: 20 },
      { yearsOfService: 6, vacationDays: 22 },
      { yearsOfService: 7, vacationDays: 22 },
      { yearsOfService: 8, vacationDays: 22 },
      { yearsOfService: 9, vacationDays: 22 },
      { yearsOfService: 10, vacationDays: 22 },
    ]

    for (const setting of vacationSettings) {
      await VacationSetting.updateOrCreate(
        { yearsOfService: setting.yearsOfService },
        { vacationDays: setting.vacationDays }
      )
    }
  }
}
