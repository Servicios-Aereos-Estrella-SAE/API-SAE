import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Person from './person.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

/**
 * @swagger
 * components:
 *   schemas:
 *      User:
 *        type: object
 *        properties:
 *          user_id:
 *            type: number
 *            description: Id del usuario
 *          user_email:
 *            type: string
 *            description: Correo electrónico del usuario
 *          user_password:
 *            type: string
 *            description: Contraseña del usuario
 *          user_token:
 *            type: string
 *            description: Token del usuario
 *          user_active:
 *            type: number
 *            description: Activo o Inactivo
 *          role_id:
 *            type: number
 *            description: Id del Rol
 *          person_id:
 *            type: number
 *            description: Id de la Persona
 *          user_created_at:
 *            type: string
 *          user_updated_at:
 *            type: string
 *          user_deleted_at:
 *            type: string
 *
 */

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['user_email'],
  passwordColumnName: 'user_password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'api_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @column({ isPrimary: true })
  declare user_id: number

  @column()
  declare user_email: string

  @column()
  declare user_token: string

  @column()
  declare user_active: number

  @column()
  declare role_id: number

  @column()
  declare person_id: number

  @column({ serializeAs: null })
  declare user_password: string

  @column.dateTime({ autoCreate: true })
  declare user_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare user_updated_at: DateTime

  @column()
  declare user_deleted_at: DateTime | null

  @belongsTo(() => Person, {
    foreignKey: 'person_id',
  })
  declare person: BelongsTo<typeof Person>
}
