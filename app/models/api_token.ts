import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
/**
 * @swagger
 * components:
 *   schemas:
 *      ApiToken:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            description: Id del token
 *          type:
 *            type: string
 *            description: Tipo del token
 *          token:
 *            type: string
 *            description: Token
 *          name:
 *            type: string
 *            description: Nombre del token
 *          user_id:
 *            type: number
 *            description: Id del usuario
 *          api_token_browser:
 *            type: string
 *            description: Navegador
 *          created_at:
 *            type: string
 *          expires_at:
 *            type: string
 *
 */

export default class ApiToken extends BaseModel {
  // public static table = 'api_tokens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: string

  @column()
  declare token: string

  @column()
  declare name: string

  @column()
  declare user_id: number

  @column()
  declare api_token_browser: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime()
  declare expires_at: DateTime
}
