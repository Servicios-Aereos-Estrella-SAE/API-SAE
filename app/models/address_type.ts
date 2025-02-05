import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

/**
 * @swagger
 * components:
 *   schemas:
 *      Addresses:
 *        type: object
 *        properties:
 *          addressId:
 *            type: number
 *            description: Id of the object
 *          addressTypeName:
 *            type: string
 *            description: Name of the address type
 *          addressTypeDescription:
 *            type: string
 *            description: Description of the address type
 *          addressTypeSlug:
 *            type: string
 *            description: SLUG of the address type
 *          addressTypecreatedAt:
 *            type: string
 *            description: Date of creation
 *          addressTypeUpdatedAt:
 *            type: string
 *            description: Date of last update
 *          addressTypeDeletedAt:
 *            type: string
 *            description: Date of logic delete
 *
 */
export default class AddressType extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare addressId: number

  @column()
  declare addressTypeName: string

  @column()
  declare addressTypeDescription: string

  @column()
  declare addressTypeSlug: string

  @column()
  declare addressTypeActive: number

  @column.dateTime({ autoCreate: true })
  declare addressTypeCreatedAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare addressTypeUpdatedAt: DateTime | null

  @column.dateTime({ columnName: 'address_type_deleted_at' })
  declare deletedAt: DateTime | null
}
