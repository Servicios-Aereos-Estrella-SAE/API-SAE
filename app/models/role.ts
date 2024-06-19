import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *      Role:
 *        type: object
 *        properties:
 *          roleId:
 *            type: number
 *            description: Role id
 *          roleName:
 *            type: string
 *            description: Role name
 *          roleSlug:
 *            type: string
 *            description: Role slug
 *          roleDescription:
 *            type: string
 *            description: Role description
 *          roleActive:
 *            type: number
 *            description: Role status
 *          roleCreatedAt:
 *            type: string
 *          roleUpdatedAt:
 *            type: string
 *          roleDeletedAt:
 *            type: string
 *
 */
export default class Role extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare roleId: number

  @column()
  declare roleName: string

  @column()
  declare roleSlug: string

  @column()
  declare roleDescription: string

  @column()
  declare roleActive: number

  @column.dateTime({ autoCreate: true })
  declare roleCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare roleUpdatedAt: DateTime

  @column.dateTime({ columnName: 'role_deleted_at' })
  declare deletedAt: DateTime | null
}
