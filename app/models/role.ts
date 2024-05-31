import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
/**
 * @swagger
 * components:
 *   schemas:
 *      Role:
 *        type: object
 *        properties:
 *          role_id:
 *            type: number
 *            description: Id del rol
 *          role_name:
 *            type: string
 *            description: Nombre del rol
 *          role_slug:
 *            type: string
 *            description: SLUG del rol
 *          role_description:
 *            type: string
 *            description: Descripción del rol
 *          role_active:
 *            type: number
 *            description: Activo o Inactivo
 *          role_created_at:
 *            type: string
 *          role_updated_at:
 *            type: string
 *          role_deleted_at:
 *            type: string
 *
 */
export default class Role extends BaseModel {
  // public static table = 'roles'

  @column({ isPrimary: true })
  declare role_id: number

  @column()
  declare role_name: string

  @column()
  declare role_slug: string

  @column()
  declare role_description: string

  @column()
  declare role_active: number

  @column.dateTime({ autoCreate: true })
  declare role_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare role_updated_at: DateTime

  @column()
  declare role_deleted_at: DateTime | null
}
