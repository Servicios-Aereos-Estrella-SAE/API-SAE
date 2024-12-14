import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
/**
 * @swagger
 * components:
 *   schemas:
 *      VacationSetting:
 *        type: object
 *        properties:
 *          vacationSettingId:
 *            type: number
 *            description: Vacation setting id
 *          vacationSettingYearsOfService:
 *            type: number
 *            description: Vacation setting years of service
 *          vacationSettingVacationDays:
 *            type: number
 *            description: Vacation setting vacation days
 *          vacationSettingCrew:
 *            type: number
 *            description: Vacation setting is crew
 *          vacationSettingApplySince:
 *            type: date
 *            description: Vacation setting apply since date
 *          vacationSettingCreatedAt:
 *            type: string
 *          vacationSettingUpdatedAt:
 *            type: string
 *          vacationSettingDeletedAt:
 *            type: string
 *
 */

export default class VacationSetting extends BaseModel {
  @column({ isPrimary: true })
  declare vacationSettingId: number

  @column()
  vacationSettingYearsOfService!: number

  @column()
  vacationSettingVacationDays!: number

  @column()
  vacationSettingApplySince!: Date | string

  @column()
  vacationSettingCrew!: number

  @column.dateTime({ autoCreate: true })
  vacationSettingCreatedAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  vacationSettingUpdatedAt!: DateTime

  @column.dateTime()
  vacationSettingDeletedAt!: DateTime | null
}
