import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AircraftClass extends BaseModel {
  @column({ isPrimary: true })
  aircraftClassId!: number

  @column()
  aircraftClassBanner!: string

  @column()
  aircraftClassLongDescription!: string

  @column()
  aircraftClassShortDescription!: string

  @column()
  aircraftClassName!: string

  @column()
  aircraftClassSlug!: string

  @column()
  aircraftClassStatus!: number

  @column.dateTime({ autoCreate: true })
  createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt!: DateTime

  @column.dateTime()
  deletedAt!: DateTime | null
}
