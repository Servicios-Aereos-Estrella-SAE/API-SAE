import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import AddressType from './address_type.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

/**
 * @swagger
 * components:
 *   schemas:
 *      Address:
 *        type: object
 *        properties:
 *          addressId:
 *            type: number
 *            description: Id of the object
 *          addressZipcode:
 *            type: string
 *            description: Zipcode address
 *          addressCountry:
 *            type: string
 *            description: Country address
 *          addressState:
 *            type: string
 *            description: State address
 *          addressTownship:
 *            type: string
 *            description: Township address
 *          addressCity:
 *            type: string
 *            description: City address
 *          addressSettlement:
 *            type: string
 *            description: Settlement address
 *          addressSettlementType:
 *            type: string
 *            description: Settlement type address
 *          addressStreet:
 *            type: string
 *            description: Street address
 *          addressInternalNumber:
 *            type: string
 *            description: Interna number address
 *          addressExternalNumber:
 *            type: string
 *            description: ExternalnNumber address
 *          addressBetweenStreet1:
 *            type: string
 *            description: Between street 1 address
 *          addressBetweenStreet2:
 *            type: string
 *            description: Between street 2 address
 *          addressTypeId:
 *            type: number
 *            description: Address type id
 *          addresscreatedAt:
 *            type: string
 *            description: Date of creation
 *          addressUpdatedAt:
 *            type: string
 *            description: Date of last update
 *          addressDeletedAt:
 *            type: string
 *            description: Date of logic delete
 *
 */
export default class Address extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare addressId: number

  @column()
  declare addressZipcode: string

  @column()
  declare addressCountry: string

  @column()
  declare addressState: string

  @column()
  declare addressTownship: string

  @column()
  declare addressCity: string

  @column()
  declare addressSettlement: string

  @column()
  declare addressSettlementType: string

  @column()
  declare addressStreet: string

  @column()
  declare addressInternalNumber: string

  @column()
  declare addressExternalNumber: string

  @column()
  declare addressBetweenStreet1: string

  @column()
  declare addressBetweenStreet2: string

  @column()
  declare addressTypeId: number

  @column.dateTime({ autoCreate: true })
  declare addressCreatedAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare addressUpdatedAt: DateTime | null

  @column.dateTime({ columnName: 'address_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => AddressType, {
    foreignKey: 'addressTypeId',
  })
  declare addressType: BelongsTo<typeof AddressType>
}
