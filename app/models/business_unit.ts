import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

/**
 * @swagger
 * components:
 *   schemas:
 *      BusinessUnit:
 *        type: object
 *        properties:
 *          businessUnitId:
 *            type: number
 *            description: Id of the object
 *          businessUnitName:
 *            type: string
 *            description: Name of the business
 *          businessUnitSlug:
 *            type: string
 *            description: Clean name of the business
 *          businessUnitLegalName:
 *            type: string
 *            description: Legal name of business
 *          businessUnitcreatedAt:
 *            type: string
 *            description: Date of creation
 *          businessUnitUpdatedAt:
 *            type: string
 *            description: Date of last update
 *          businessUnitDeletedAt:
 *            type: string
 *            description: Date of logic delete
 *
 */
export default class BusinessUnit extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare businessUnitId: number

  @column()
  declare businessUnitName: string

  @column()
  declare businessUnitSlug: string

  @column()
  declare businessUnitLegalName: string

  @column()
  declare businessUnitActive: number

  @column.dateTime({ autoCreate: true })
  declare businessUnitCreatedAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare businessUnitUpdatedAt: DateTime | null

  @column.dateTime()
  declare businessUnitDeletedAt: DateTime | null
}
