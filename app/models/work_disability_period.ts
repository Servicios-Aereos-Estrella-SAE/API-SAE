import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import WorkDisability from './work_disability.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import WorkDisabilityType from './work_disability_type.js'
import WorkDisabilityPeriodExpense from './work_disability_period_expense.js'
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

  @belongsTo(() => WorkDisability, {
    foreignKey: 'workDisabilityId',
    onQuery: (query) => {
      query.preload('insuranceCoverageType')
    },
  })
  declare workDisability: BelongsTo<typeof WorkDisability>

  @belongsTo(() => WorkDisabilityType, {
    foreignKey: 'workDisabilityTypeId',
  })
  declare workDisabilityType: BelongsTo<typeof WorkDisabilityType>

  @hasMany(() => WorkDisabilityPeriodExpense, {
    foreignKey: 'workDisabilityPeriodId',
  })
  declare workDisabilityPeriodExpenses: HasMany<typeof WorkDisabilityPeriodExpense>
}
