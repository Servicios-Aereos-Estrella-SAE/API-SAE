import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import Person from './person.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      Customer:
 *        type: object
 *        properties:
 *          customerId:
 *            type: number
 *            description: Customer Id
 *          customerUuid:
 *            type: string
 *            description: Customer uuid
 *          personId:
 *            type: number
 *            description: Person id
 *          customerCreatedAt:
 *            type: string
 *          customerUpdatedAt:
 *            type: string
 *          customerDeletedAt:
 *            type: string
 *
 */
export default class Customer extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare customerId: number

  @column()
  declare customerUuid: string

  @column()
  declare personId: number

  @column.dateTime({ autoCreate: true })
  declare customerCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare customerUpdatedAt: DateTime

  @column.dateTime({ columnName: 'customer_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Person, {
    foreignKey: 'personId',
  })
  declare person: BelongsTo<typeof Person>
}
