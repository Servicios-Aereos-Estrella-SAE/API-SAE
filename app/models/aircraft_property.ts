import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import AircraftClass from './aircraft_class.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class AircraftProperty extends BaseModel {
  @column({ isPrimary: true })
  aircraftPropertiesId!: number

  @column()
  aircraftPropertiesName!: string

  @column()
  aircraftClassId!: number

  @column()
  aircraftPropertiesPax!: number

  @column()
  aircraftPropertiesSpeed!: number

  @column()
  aircraftPropertiesMaxKg!: number

  @column()
  aircraftPropertiesAutonomy!: number

  @column()
  aircraftPropertiesAutonomyHours!: number

  @column()
  aircraftPropertiesHourlyRate!: number

  @column()
  aircraftPropertiesLandingCostBase!: number

  @column()
  aircraftPropertiesLandingCostNational!: number

  @column()
  aircraftPropertiesLandingCostInternational!: number

  @column()
  aircraftPropertiesOvernightStayLocal!: number

  @column()
  aircraftPropertiesOvernightStayInternational!: number

  @column()
  aircraftPropertiesFuelSurcharge!: number

  @column()
  aircraftPropertiesDescription!: string | null

  @column()
  aircraftPropertiesBanner!: string

  @column.dateTime({ autoCreate: true })
  aircraftPropertiesCreatedAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  aircraftPropertiesUpdatedAt!: DateTime

  @column.dateTime()
  aircraftPropertiesDeletedAt!: DateTime | null

  @belongsTo(() => AircraftClass, { foreignKey: 'aircraftClassId' })
  declare aircraftClass: relations.BelongsTo<typeof AircraftClass>
}
