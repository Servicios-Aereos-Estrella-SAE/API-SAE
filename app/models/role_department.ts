import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Department from './department.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      RoleDepartment:
 *        type: object
 *        properties:
 *          roleDepartmentId:
 *            type: number
 *            description: Role system permission id
 *          roleId:
 *            type: number
 *            description: Role id
 *          departmentId:
 *            type: number
 *            description: Department id
 *          roleDepartmentCreatedAt:
 *            type: string
 *          roleDepartmentUpdatedAt:
 *            type: string
 *          roleDepartmentDeletedAt:
 *            type: string
 *
 */

export default class RoleDepartment extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare roleDepartmentId: number

  @column()
  declare roleId: number

  @column()
  declare departmentId: number

  @column.dateTime({ autoCreate: true })
  declare roleDepartmentCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare roleDepartmentUpdatedAt: DateTime

  @column.dateTime({ columnName: 'role_department_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Department, {
    foreignKey: 'departmentId',
  })
  declare department: BelongsTo<typeof Department>
}
