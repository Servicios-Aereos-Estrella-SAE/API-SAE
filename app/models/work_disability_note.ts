import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import User from './user.js'
/**
 * @swagger
 * components:
 *   schemas:
 *      WorkDisabilityNote:
 *        type: object
 *        properties:
 *          workDisabilityNoteId:
 *            type: number
 *            description: Work disability period ID
 *          workDisabilityNoteDescription:
 *           type: string
 *           description: Work disability note description
 *          workDisabilityId:
 *            type: number
 *            description: Work disability Id
 *          userId:
 *            type: number
 *            description: User Id
 *          workDisabilityNoteCreatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityNoteUpdatedAt:
 *            type: string
 *            format: date-time
 *          workDisabilityNoteDeletedAt:
 *            type: string
 *            format: date-time
 *            nullable: true
 */
export default class WorkDisabilityNote extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare workDisabilityNoteId: number

  @column()
  declare workDisabilityNoteDescription: string

  @column()
  declare workDisabilityId: number

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare workDisabilityNoteCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare workDisabilityNoteUpdatedAt: DateTime

  @column.dateTime({ columnName: 'work_disability_note_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => User, {
    foreignKey: 'userId',
    onQuery: (query) => {
      query.preload('person')
    },
  })
  declare user: BelongsTo<typeof User>
}
