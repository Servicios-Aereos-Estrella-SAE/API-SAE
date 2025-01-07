import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *      WorkDisabilityPeriod:
 *        type: object
 *        properties:
 *          workDisabilityPeriodId:
 *            type: number
 *            description: Work disability period ID
 *          workDisabilityPeriodStartDate:
 *            type: string
 *            format: date
 *            description: Work disability period start date
 *          workDisabilityPeriodEndDate:
 *            type: string
 *            format: date
 *            description: Work disability period end date
 *          workDisabilityPeriodTicketFolio:
 *            type: string
 *            description: Work disability period ticket folio
 *          workDisabilityPeriodFile:
 *            type: string
 *            description: Work disability period file
 *          workDisabilityId:
 *            type: number
 *            description: Work disability Id
 *          workDisabilityTypeId:
 *            type: number
 *            description: Work disability type Id
 *          workDisabilityPeriodCreatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityPeriodUpdatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityPeriodDeletedAt:
 *            type: string
 *            format: date-time
 *            nullable: true
 */
export default class WorkDisabilityPeriod extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare workDisabilityPeriodId: number

  @column()
  declare workDisabilityPeriodStartDate: string

  @column()
  declare workDisabilityPeriodEndDate: string

  @column()
  declare workDisabilityPeriodTicketFolio: string

  @column()
  declare workDisabilityPeriodFile: string

  @column()
  declare workDisabilityId: number

  @column()
  declare workDisabilityTypeId: number

  @column.dateTime({ autoCreate: true })
  declare workDisabilityPeriodCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare workDisabilityPeriodUpdatedAt: DateTime

  @column.dateTime({ columnName: 'work_disability_period_deleted_at' })
  declare deletedAt: DateTime | null
}
