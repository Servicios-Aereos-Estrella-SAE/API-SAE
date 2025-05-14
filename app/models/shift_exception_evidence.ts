import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ShiftException from './shift_exception.js'
/**
 * @swagger
 * components:
 *   schemas:
 *     ShiftExceptionEvidence:
 *       type: object
 *       properties:
 *         shiftExceptionEvidenceId:
 *           type: number
 *           description: Shift exception evidence ID
 *         shiftExceptionEvidenceFile:
 *           type: string
 *           description: Shift exception evidence file
 *         shiftExceptionEvidenceType:
 *           type: string
 *           description: Shift exception evidence type
 *         shiftExceptionId:
 *           type: number
 *           description: Shift exception id
 *         shiftExceptionEvidenceCreatedAt:
 *           type: string
 *           format: date-time
 *         shiftExceptionEvidenceUpdatedAt:
 *           type: string
 *           format: date-time
 *         shiftExceptionEvidenceDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
export default class ShiftExceptionEvidence extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare shiftExceptionEvidenceId: number

  @column()
  declare shiftExceptionEvidenceFile: string

  @column()
  declare shiftExceptionEvidenceType: string

  @column()
  declare shiftExceptionId: number

  @column.dateTime({ autoCreate: true })
  declare shiftExceptionEvidenceCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare shiftExceptionEvidenceUpdatedAt: DateTime

  @column.dateTime({ columnName: 'shift_exception_evidence_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => ShiftException, {
    foreignKey: 'shiftExceptionId',
  })
  declare shiftException: BelongsTo<typeof ShiftException>
}
