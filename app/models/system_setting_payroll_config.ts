import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'

/**
 * @swagger
 * components:
 *   schemas:
 *      SystemSettingPayrollConfig:
 *        type: object
 *        properties:
 *          systemSettingPayrollConfigId:
 *            type: number
 *            description: System setting payroll config id
 *          systemSettingPayrollConfigPaymentType:
 *            type: string
 *            description: System setting payroll config payment type
 *          systemSettingPayrollConfigFixedDay:
 *            type: string
 *            description: System setting payroll config fixed day
 *          systemSettingPayrollConfigFixedEveryNWeeks:
 *            type: number
 *            description: System setting payroll config fixed every n weeks
 *          systemSettingPayrollConfigNumberOfDaysToBePaid:
 *            type: number
 *            description: System setting payroll config number of days to be paid
 *          systemSettingPayrollConfigNumberOfOverdueDaysToOffset:
 *            type: number
 *            description: System setting payroll config number of overdue days to offset
 *          systemSettingPayrollConfigApplySince:
 *            type: date
 *            description: System setting payroll config apply since date
 *          systemSettingId:
 *            type: number
 *            description: System setting id
 *          systemSettingPayrollConfigCreatedAt:
 *            type: string
 *          systemSettingPayrollConfigUpdatedAt:
 *            type: string
 *          systemSettingPayrollConfigDeletedAt:
 *            type: string
 *
 */
export default class SystemSettingPayrollConfig extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare systemSettingPayrollConfigId: number

  @column()
  declare systemSettingPayrollConfigPaymentType: string

  @column()
  declare systemSettingPayrollConfigFixedDay: string

  @column()
  declare systemSettingPayrollConfigFixedEveryNWeeks: number

  @column()
  declare systemSettingPayrollConfigNumberOfDaysToBePaid: number

  @column()
  declare systemSettingPayrollConfigNumberOfOverdueDaysToOffset: number

  @column()
  declare systemSettingPayrollConfigApplySince: string | Date

  @column()
  declare systemSettingId: number

  @column.dateTime({ autoCreate: true })
  declare systemSettingPayrollConfigCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare systemSettingPayrollConfigUpdatedAt: DateTime

  @column.dateTime({ columnName: 'system_setting_payroll_config_deleted_at' })
  declare deletedAt: DateTime | null
}
