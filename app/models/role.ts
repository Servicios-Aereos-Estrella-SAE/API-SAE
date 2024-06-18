import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
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
export default class Role extends BaseModel {
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

  @column()
  declare roleDeletedAt: DateTime | null
}
