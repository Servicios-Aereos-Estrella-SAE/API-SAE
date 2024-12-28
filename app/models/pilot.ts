import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import Employee from './employee.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      Pilot:
 *        type: object
 *        properties:
 *          pilotId:
 *            type: number
 *            description: Pilot Id
 *          pilotHireDate:
 *            type: date
 *            description: Pilot hire date
 *          pilotPhoto:
 *            type: string
 *            description: Pilot photo
 *          employeeId:
 *            type: number
 *            description: Employee id
 *          pilotCreatedAt:
 *            type: string
 *          pilotUpdatedAt:
 *            type: string
 *          pilotDeletedAt:
 *            type: string
 *
 */
export default class Pilot extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare pilotId: number

  @column.date()
  declare pilotHireDate: DateTime

  @column()
  declare pilotPhoto: string

  @column()
  declare employeeId: number

  @column.dateTime({ autoCreate: true })
  declare pilotCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare pilotUpdatedAt: DateTime

  @column.dateTime({ columnName: 'pilot_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Employee, {
    foreignKey: 'employeeId',
  })
  declare employee: BelongsTo<typeof Employee>
}
