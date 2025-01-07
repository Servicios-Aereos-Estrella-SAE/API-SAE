import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *     InsuranceCoverageType:
 *       type: object
 *       properties:
 *        insuranceCoverageTypeId:
 *           type: number
 *           description: Insurance coverage type ID
 *         insuranceCoverageTypeName:
 *           type: string
 *           description: Insurance coverage type name
 *         insuranceCoverageTypeDescription:
 *           type: string
 *           description: Insurance coverage type description
 *         insuranceCoverageTypeSlug:
 *           type: string
 *           description: Insurance coverage type SLUG
 *         insuranceCoverageTypeActive:
 *           type: number
 *           description: Insurance coverage type status
 *         insuranceCoverageTypeCreatedAt:
 *           type: string
 *           format: date-time
 *         insuranceCoverageTypeUpdatedAt:
 *           type: string
 *           format: date-time
 *         insuranceCoverageTypeDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
export default class InsuranceCoverageType extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare insuranceCoverageTypeId: number

  @column()
  declare insuranceCoverageTypeName: string

  @column()
  declare insuranceCoverageTypeDescription: string

  @column()
  declare insuranceCoverageTypeSlug: string

  @column()
  declare insuranceCoverageTypeActive: number

  @column.dateTime({ autoCreate: true })
  declare insuranceCoverageTypeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare insuranceCoverageTypeUpdatedAt: DateTime

  @column.dateTime({ columnName: 'insurance_coverage_type_deleted_at' })
  declare deletedAt: DateTime | null
}
