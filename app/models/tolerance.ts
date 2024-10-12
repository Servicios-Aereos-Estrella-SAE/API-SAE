import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Tolerance extends BaseModel {
  @column({ isPrimary: true })
  toleranceId!: number

  @column()
  toleranceName!: string
  @column()
  toleranceMinutes!: number
  @column.dateTime({ autoCreate: true })
  declare toleranceCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare toleranceUpdatedAt: DateTime

  @column.dateTime({ columnName: 'tolerance_deleted_at' })
  declare deletedAt: DateTime | null
}
