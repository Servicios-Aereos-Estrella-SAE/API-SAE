import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import ProceedingFile from './proceeding_file.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from './customer.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      CustomerProceedingFile:
 *        type: object
 *        properties:
 *          customerProceedingFileId:
 *            type: number
 *            description: Customer proceeding file id
 *          customerId:
 *            type: number
 *            description: Customer id
 *          proceedingFileId:
 *            type: number
 *            description: Proceeding file id
 *          customerProceedingFileCreatedAt:
 *            type: string
 *          customerProceedingFileUpdatedAt:
 *            type: string
 *          customerProceedingFileDeletedAt:
 *            type: string
 *
 */
export default class CustomerProceedingFile extends compose(BaseModel, SoftDeletes) {
  static table = 'customer_proceeding_files'

  @column({ isPrimary: true })
  declare customerProceedingFileId: number

  @column()
  declare customerId: number

  @column()
  declare proceedingFileId: number

  @column.dateTime({ autoCreate: true })
  declare customerProceedingFileCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare customerProceedingFileUpdatedAt: DateTime

  @column.dateTime({ columnName: 'customer_proceeding_file_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Customer, {
    foreignKey: 'customerId',
  })
  declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => ProceedingFile, {
    foreignKey: 'proceedingFileId',
  })
  declare proceedingFile: BelongsTo<typeof ProceedingFile>
}
