/* eslint-disable max-len */
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

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
