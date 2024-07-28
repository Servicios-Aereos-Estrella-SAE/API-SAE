import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class VacationSetting extends BaseModel {
  @column({ isPrimary: true })
  id!: number

  @column()
  yearsOfService!: number

  @column()
  vacationDays!: number

  @column.dateTime({ autoCreate: true })
  createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt!: DateTime

  @column.dateTime()
  deletedAt!: DateTime | null
}
