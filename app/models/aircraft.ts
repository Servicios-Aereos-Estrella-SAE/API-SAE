import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Airport from './airport.js'
import * as relations from '@adonisjs/lucid/types/relations'
import AircraftProperty from './aircraft_property.js'

export default class Aircraft extends BaseModel {
  static table = 'aircrafts'

  @column({ isPrimary: true })
  aircraftId!: number

  @column()
  aircraftRegistrationNumber!: string

  @column()
  aircraftSerialNumber!: string

  @column()
  airportId!: number

  @column()
  aircraftPropertiesId!: number

  @column()
  aircraftActive!: number
  @belongsTo(() => Airport)
  airport!: relations.BelongsTo<typeof Airport>

  @belongsTo(() => AircraftProperty)
  aircraftProperty!: relations.BelongsTo<typeof AircraftProperty>

  @column.dateTime({ autoCreate: true })
  aircraftCreatedAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  aircraftUpdatedAt!: DateTime

  @column.dateTime()
  aircraftDeletedAt!: DateTime | null
}
