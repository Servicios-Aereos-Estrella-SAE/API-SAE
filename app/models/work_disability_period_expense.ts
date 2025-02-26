import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import WorkDisabilityPeriod from './work_disability_period.js'
/**
 * @swagger
 * components:
 *   schemas:
 *      WorkDisabilityPeriodExpense:
 *        type: object
 *        properties:
 *          workDisabilityPeriodExpenseId:
 *            type: number
 *            description: Work disability period expense ID
 *          workDisabilityPeriodExpenseFile:
 *            type: string
 *            description: Work disability period expense file
 *          workDisabilityPeriodExpenseAmount:
 *            type: number
 *            description: Work disability period expense amount
 *          workDisabilityPeriodId:
 *            type: number
 *            description: Work disability period Id
 *          workDisabilityPeriodExpenseCreatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityPeriodExpenseUpdatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityPeriodExpenseDeletedAt:
 *            type: string
 *            format: date-time
 *            nullable: true
 */
export default class WorkDisabilityPeriodExpense extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare workDisabilityPeriodExpenseId: number

  @column()
  declare workDisabilityPeriodExpenseFile: string

  @column()
  declare workDisabilityPeriodExpenseAmount: number

  @column()
  declare workDisabilityPeriodId: number

  @column.dateTime({ autoCreate: true })
  declare workDisabilityPeriodExpenseCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare workDisabilityPeriodExpenseUpdatedAt: DateTime

  @column.dateTime({ columnName: 'work_disability_period_expense_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => WorkDisabilityPeriod, {
    foreignKey: 'workDisabilityPeriodId',
  })
  declare workDisabilityPeriod: BelongsTo<typeof WorkDisabilityPeriod>
}
