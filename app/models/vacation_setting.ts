import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class VacationSetting extends BaseModel {
  @column({ isPrimary: true })
  vacationSettingId!: number

  @column()
  vacationSettingYearsOfService!: number

  @column()
  vacationSettingVacationDays!: number

  @column.dateTime({ autoCreate: true })
  createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt!: DateTime

  @column.dateTime()
  deletedAt!: DateTime | null
}
