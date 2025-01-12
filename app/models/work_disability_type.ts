import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *      WorkDisabilityType:
 *        type: object
 *        properties:
 *          workDisabilityTypeId:
 *            type: number
 *            description: Work disability type ID
 *          workDisabilityTypeName:
 *            type: string
 *            description: Work disability type name
 *          workDisabilityTypeDescription:
 *            type: string
 *            description: Work disability type description
 *          workDisabilityTypeSlug:
 *            type: string
 *            description: Work disability type SLUG
 *          workDisabilityTypeActive:
 *            type: number
 *            description: Work disability type status
 *          workDisabilityTypeCreatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityTypeUpdatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityTypeDeletedAt:
 *            type: string
 *            format: date-time
 *            nullable: true
 */
export default class WorkDisabilityType extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare workDisabilityTypeId: number

  @column()
  declare workDisabilityTypeName: string

  @column()
  declare workDisabilityTypeDescription: string

  @column()
  declare workDisabilityTypeSlug: string

  @column()
  declare workDisabilityTypeActive: number

  @column.dateTime({ autoCreate: true })
  declare workDisabilityTypeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare workDisabilityTypeUpdatedAt: DateTime

  @column.dateTime({ columnName: 'work_disability_type_deleted_at' })
  declare deletedAt: DateTime | null
}
