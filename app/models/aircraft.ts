import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Airport from './airport.js'
import * as relations from '@adonisjs/lucid/types/relations'
import AircraftProperty from './aircraft_property.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Pilot from './pilot.js'
import AircraftOperator from './aircraft_operator.js'

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

  @belongsTo(() => AircraftProperty, {
    foreignKey: 'aircraftPropertiesId',
  })
  declare aircraftProperty: BelongsTo<typeof AircraftProperty>

  @manyToMany(() => Pilot, {
    pivotTable: 'aircraft_pilots',
    localKey: 'aircraftId',
    pivotForeignKey: 'aircraft_id',
    relatedKey: 'pilotId',
    pivotRelatedForeignKey: 'pilot_id',
    pivotColumns: ['aircraft_pilot_role'],
  })
  declare pilots: ManyToMany<typeof Pilot>

  @column()
  aircraftOperatorId!: number

  @belongsTo(() => AircraftOperator, {
    foreignKey: 'aircraftOperatorId',
  })
  aircraftOperator!: BelongsTo<typeof AircraftOperator>

  @column.dateTime({ autoCreate: true })
  aircraftCreatedAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  aircraftUpdatedAt!: DateTime

  @column.dateTime()
  aircraftDeletedAt!: DateTime | null
}
