import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Airport extends BaseModel {
  @column({ isPrimary: true })
  airportId!: number

  @column()
  airportType:
    | 'heliport'
    | 'small_airport'
    | 'seaplane_base'
    | 'balloonport'
    | 'medium_airport'
    | 'large_airport' = 'heliport'

  @column()
  airportName!: string

  @column()
  airportLatitudeDeg!: number

  @column()
  airportLongitudeDeg!: number

  @column()
  airportElevationFt!: number

  @column()
  airportDisplayLocationName!: string

  @column()
  airportIsoCountry!: string

  @column()
  airportIsoRegion!: string

  @column()
  airportActive!: number

  @column()
  airportIcaoCode!: string

  @column()
  airportIataCode!: string | null

  @column.dateTime({ autoCreate: true })
  airportCreatedAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  airportUpdatedAt!: DateTime

  @column.dateTime()
  airportDeletedAt!: DateTime | null
}
