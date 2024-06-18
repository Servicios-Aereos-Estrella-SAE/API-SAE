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
 *          userId:
 *            type: number
 *            description: User id
 *          userEmail:
 *            type: string
 *            description: User email
 *          userPassword:
 *            type: string
 *            description: User password
 *          userToken:
 *            type: string
 *            description: User token
 *          userActive:
 *            type: number
 *            description: User status
 *          userPinCode:
 *            type: string
 *            description: User pin code
 *          userPinCodeExpiresAt:
 *            type: Date
 *            description: User expiration date pin code
 *          roleId:
 *            type: number
 *            description: Role id
 *          personId:
 *            type: number
 *            description: Person id
 *          userCreatedAt:
 *            type: string
 *          userUpdatedAt:
 *            type: string
 *          userDeletedAt:
 *            type: string
 *
 */

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['userEmail'],
  passwordColumnName: 'userPassword',
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
  declare userId: number

  @column()
  declare userEmail: string

  @column({ serializeAs: null })
  declare userPassword: string

  @column()
  declare userToken: string

  @column()
  declare userActive: number

  @column()
  declare userPinCode: string

  @column()
  declare userPinCodeExpiresAt: DateTime | null

  @column()
  declare roleId: number

  @column()
  declare personId: number

  @column.dateTime({ autoCreate: true })
  declare userCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare userUpdatedAt: DateTime

  @column()
  declare userDeletedAt: DateTime | null

  @belongsTo(() => Person, {
    foreignKey: 'personId',
  })
  declare person: BelongsTo<typeof Person>
}
