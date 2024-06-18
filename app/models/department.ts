import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

/**
 * @swagger
 * components:
 *   schemas:
 *      Department:
 *        type: object
 *        properties:
 *          departmentId:
 *            type: number
 *            description: Department id
 *          departmentSyncId:
 *            type: number
 *            description: Imported department id
 *          departmentCode:
 *            type: string
 *            description: Department code
 *          departmentName:
 *            type: string
 *            description: Department name
 *          departmentAlias:
 *            type: string
 *            description: Department alias
 *          departmentIsDefault:
 *            type: boolean
 *            description: If the department is the default
 *          departmentActive:
 *            type: number
 *            description: Status
 *          parentDepartmentId:
 *            type: number
 *            description: Related department id
 *          parentDepartmentSyncId:
 *            type: number
 *            description: Imported related department id
 *          companyId:
 *            type: number
 *            description: Company id
 *          departmentLastSynchronizationAt:
 *            type: string
 *            description: Last synchronization date
 *          departmentCreatedAt:
 *            type: string
 *          departmentUpdatedAt:
 *            type: string
 *          departmentDeletedAt:
 *            type: string
 *
 */
export default class Department extends BaseModel {
  @column({ isPrimary: true })
  declare departmentId: number

  @column()
  declare departmentSyncId: number

  @column()
  declare departmentCode: string

  @column()
  declare departmentName: string

  @column()
  declare departmentAlias: string

  @column()
  declare departmentIsDefault: boolean

  @column()
  declare departmentActive: number

  @column()
  declare parentDepartmentId: number | null

  @column()
  declare parentDepartmentSyncId: number

  @column()
  declare companyId: number

  @column()
  declare departmentLastSynchronizationAt: Date

  @belongsTo(() => Department, {
    foreignKey: 'parentDepartmentId',
  })
  declare parentDepartment: BelongsTo<typeof Department>

  @hasMany(() => Department, {
    foreignKey: 'parentDepartmentId',
  })
  declare subDepartments: HasMany<typeof Department>

  @column.dateTime({ autoCreate: true })
  declare departmentCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare departmentUpdatedAt: DateTime

  @column()
  declare departmentDeletedAt: DateTime | null
}
