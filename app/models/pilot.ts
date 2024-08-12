import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import Person from './person.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      Pilot:
 *        type: object
 *        properties:
 *          pilotd:
 *            type: number
 *            description: Pilot Id
 *          pilotPhoto:
 *            type: string
 *            description: Pilot photo
 *          personId:
 *            type: number
 *            description: Person id
 *          pilotCreatedAt:
 *            type: string
 *          pilotUpdatedAt:
 *            type: string
 *          pilotDeletedAt:
 *            type: string
 *
 */
export default class Pilot extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare pilotId: number

  @column()
  declare pilotPhoto: string

  @column()
  declare personId: number

  @column.dateTime({ autoCreate: true })
  declare pilotCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare pilotUpdatedAt: DateTime

  @column.dateTime({ columnName: 'pilot_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Person, {
    foreignKey: 'personId',
  })
  declare person: BelongsTo<typeof Person>
}
