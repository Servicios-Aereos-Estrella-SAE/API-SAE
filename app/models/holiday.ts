import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Holiday extends BaseModel {
  @column({ isPrimary: true })
  declare holiday_id: number

  @column()
  declare holiday_name: string

  @column()
  declare holiday_date: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime
}
