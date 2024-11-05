/* eslint-disable max-len */
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'
import Employee from './employee.js'
/**
 * @swagger
 * components:
 *   schemas:
 *      Person:
 *        type: object
 *        properties:
 *          personId:
 *            type: number
 *            description: Person id
 *          personFirstname:
 *            type: string
 *            description: Person firstname
 *          personLastname:
 *            type: string
 *            description: Person lastname
 *          personSecondLastname:
 *            type: string
 *            description: Person second lastname
 *          personGender:
 *            type: string
 *            description: Person gender
 *          personBirthday:
 *            type: string
 *            description: Person birthday (YYYY-MM-DD)
 *          personPhone:
 *            type: string
 *            description: Person phone
 *          personCurp:
 *            type: string
 *            description: Person CURP unique
 *          personRfc:
 *            type: string
 *            description: Person RFC with homoclave, unique
 *          personImssNss:
 *            type: string
 *            description: Person social security number
 *          personCreatedAt:
 *            type: string
 *          personUpdatedAt:
 *            type: string
 *          personDeletedAt:
 *            type: string
 *
 */

export default class Person extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare personId: number

  @column()
  declare personFirstname: string

  @column()
  declare personLastname: string

  @column()
  declare personSecondLastname: string

  @column()
  declare personGender: string

  @column()
  declare personBirthday: string

  @column()
  declare personPhone: string

  @column()
  declare personCurp: string

  @column()
  declare personRfc: string

  @column()
  declare personImssNss: string

  @column.dateTime({ autoCreate: true })
  declare personCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare personUpdatedAt: DateTime

  @column.dateTime({ columnName: 'person_deleted_at' })
  declare deletedAt: DateTime | null

  @hasOne(() => Employee, {
    foreignKey: 'personId',
    localKey: 'personId',
    onQuery: (query) => {
      query.whereNull('deletedAt')
    },
  })
  declare employee: HasOne<typeof Employee>
}
