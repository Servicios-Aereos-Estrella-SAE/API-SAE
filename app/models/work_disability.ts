import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import Employee from './employee.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import InsuranceCoverageType from './insurance_coverage_type.js'
/**
 * @swagger
 * components:
 *   schemas:
 *      WorkDisability:
 *        type: object
 *        properties:
 *          workDisabilityId:
 *            type: number
 *            description: Work disability ID
 *          workDisabilityUuid:
 *            type: string
 *            description: Work disability UUID
 *          employeeId:
 *            type: number
 *            description: Employee id
 *          insuranceCoverageTypeId:
 *            type: number
 *            description: Insurance Coverage Type Id
 *          workDisabilityCreatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityUpdatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityDeletedAt:
 *            type: string
 *            format: date-time
 *            nullable: true
 */
export default class WorkDisability extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare workDisabilityId: number

  @column()
  declare workDisabilityUuid: string

  @column()
  declare employeeId: number

  @column()
  declare insuranceCoverageTypeId: number

  @column.dateTime({ autoCreate: true })
  declare workDisabilityCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare workDisabilityUpdatedAt: DateTime

  @column.dateTime({ columnName: 'work_disability_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Employee, {
    foreignKey: 'employeeId',
  })
  declare employee: BelongsTo<typeof Employee>

  @belongsTo(() => InsuranceCoverageType, {
    foreignKey: 'insuranceCoverageTypeId',
  })
  declare insuranceCoverageType: BelongsTo<typeof InsuranceCoverageType>
}
