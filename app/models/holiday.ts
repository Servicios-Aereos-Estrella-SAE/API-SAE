import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Holiday extends BaseModel {
  @column({ isPrimary: true })
  declare holidayId: number

  @column()
  declare holidayName: string

  @column()
  declare holidayDate: string

  @column()
  declare holidayIcon: string

  @column.dateTime({ autoCreate: true })
  declare holidayCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare holidayUpdatedAt: DateTime

  @column.dateTime()
  declare holidayDeletedAt: DateTime
}
