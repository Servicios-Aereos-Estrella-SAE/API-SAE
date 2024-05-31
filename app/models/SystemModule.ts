import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

/**
 * @swagger
 * components:
 *   schemas:
 *      SystemModule:
 *        type: object
 *        properties:
 *          system_module_id:
 *            type: number
 *            description: Id del modulo
 *          system_module_name:
 *            type: string
 *            description: Nombre del modulo
 *          system_module_slug:
 *            type: string
 *            description: SLUG del modulo
 *          system_module_description:
 *            type: string
 *            description: Descripción del modulo
 *          system_modules:
 *            type: string
 *            description: Orden
 *          system_module_path:
 *            type: string
 *            description: Ruta del modulo
 *          system_module_group:
 *            type: string
 *            description: Grupo del modulo
 *          system_module_active:
 *            type: number
 *            description: Activo o Inactivo
 *          system_module_icon:
 *            type: string
 *            description: Ruta de imagen del icono del modulo
 *          system_module_created_at:
 *            type: string
 *          system_module_updated_at:
 *            type: string
 *          system_module_deleted_at:
 *            type: string
 *
 */

export default class SystemModule extends BaseModel {
  // public static table = 'system_modules'

  @column({ isPrimary: true })
  declare system_module_id: number

  @column()
  declare system_module_name: string

  @column()
  declare system_module_slug: string

  @column()
  declare system_module_description: string

  @column()
  declare system_modules: string

  @column()
  declare system_module_path: string

  @column()
  declare system_module_group: string

  @column()
  declare system_module_active: number

  @column()
  declare system_module_icon: string

  @column.dateTime({ autoCreate: true })
  declare system_module_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare system_module_updated_at: DateTime

  @column()
  declare system_module_deleted_at: DateTime | null
}
