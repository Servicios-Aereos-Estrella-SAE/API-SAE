/* eslint-disable max-len */
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
/**
 * @swagger
 * components:
 *   schemas:
 *      Person:
 *        type: object
 *        properties:
 *          person_id:
 *            type: number
 *            description: ID del recurso
 *          person_firstname:
 *            type: string
 *            description: Nombre o nombres de la persona
 *          person_lastname:
 *            type: string
 *            description: Primer apellido
 *          person_second_lastname:
 *            type: string
 *            description: Segundo apellido
 *          person_gender:
 *            type: string
 *            description: Género de la persona
 *          person_birthday:
 *            type: string
 *            description: Fecha de nacimiento de la persona (YYYY-MM-DD)
 *          person_phone:
 *            type: string
 *            description: Número de teléfono
 *          person_curp:
 *            type: string
 *            description: CURP única de la persona
 *          person_rfc:
 *            type: string
 *            description: RFC con homoclave, único de la pesona
 *          person_imss_nss:
 *            type: string
 *            description: Número del seguro social
 *          person_created_at:
 *            type: string
 *            description: Fecha en la que el recurso ha sido creado
 *          person_updated_at:
 *            type: string
 *            description: Ultima fecha en la que el recurso ha sido actualizado
 *          person_deleted_at:
 *            type: string
 *            description: Fecha en la que el recurso ha sido eliminado
 *
 */

export default class Person extends BaseModel {
  // public static table = 'people'

  @column({ isPrimary: true })
  declare person_id: number

  @column()
  declare person_firstname: string

  @column()
  declare person_lastname: string

  @column()
  declare person_second_lastname: string

  @column()
  declare person_gender: string

  @column()
  declare person_birthday: string

  @column()
  declare person_phone: string

  @column()
  declare person_curp: string

  @column()
  declare person_rfc: string

  @column()
  declare person_imss_nss: string

  @column.dateTime({ autoCreate: true })
  declare person_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare person_updated_at: DateTime

  @column()
  declare person_deleted_at: DateTime | null
}
