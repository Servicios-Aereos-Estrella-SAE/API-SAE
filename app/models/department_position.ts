import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Position from './position.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'

/**
 * @swagger
 * components:
 *   schemas:
 *      DepartmentPosition:
 *        type: object
 *        properties:
 *          departmentPositionId:
 *            type: number
 *            description: Department position id
 *          departmentId:
 *            type: number
 *            description: Department id
 *          positionId:
 *            type: number
 *            description: Position id
 *          departmentPositionLastSynchronizationAt:
 *            type: string
 *            description: Last sync date
 *          departmentPositionCreatedAt:
 *            type: string
 *          departmentPositionUpdatedAt:
 *            type: string
 *          departmentPositionDeletedAt:
 *            type: string
 *
 */
export default class DepartmentPosition extends compose(BaseModel, SoftDeletes) {
  static table = 'department_position'

  @column({ isPrimary: true })
  declare departmentPositionId: number

  @column()
  declare departmentId: number

  @column()
  declare positionId: number

  @column()
  declare departmentPositionLastSynchronizationAt: Date

  @column.dateTime({ autoCreate: true })
  declare departmentPositionCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare departmentPositionUpdatedAt: DateTime

  @column.dateTime({ columnName: 'department_position_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Position, {
    foreignKey: 'positionId',
  })
  declare position: BelongsTo<typeof Position>
}
