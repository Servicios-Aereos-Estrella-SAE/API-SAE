import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['user_email'],
  passwordColumnName: 'user_password',
})

export default class User extends compose(BaseModel, AuthFinder) {
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
}
