import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
/**
 * @swagger
 * components:
 *   schemas:
 *     ProceedingFileTypeProperty:
 *       type: object
 *       properties:
 *         proceedingFileTypePropertyId:
 *           type: number
 *           description: Proceeding file type property ID
 *         proceedingFileTypePropertyName:
 *           type: string
 *           nullable: true
 *           description: Proceeding file type property name
 *         proceedingFileTypePropertyType:
 *           type: string
 *           nullable: true
 *           description: Proceeding file type property type
 *         proceedingFileTypePropertyCategoryName:
 *           type: string
 *           nullable: true
 *           description: Proceeding file type property category name
 *         proceedingFileTypeId:
 *           type: number
 *           nullable: true
 *           description: Proceeding file type id
 *         proceedingFileTypePropertyCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the proceeding file type property was created
 *         proceedingFileTypePropertyUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the proceeding file type property was last updated
 *         proceedingFileTypePropertyDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the proceeding file type property was soft-deleted
 *       example:
 *         proceedingFileTypePropertyId: 1
 *         proceedingFileTypePropertyName: 'Idioma/Nivel'
 *         proceedingFileTypePropertyType: 'Text'
 *         proceedingFileTypePropertyCategoryName: 'Idiomas'
 *         proceedingFileTypeId: 1
 *         proceedingFileTypePropertyCreatedAt: '2025-03-12T12:00:00Z'
 *         proceedingFileTypePropertyUpdatedAt: '2025-03-12T13:00:00Z'
 *         proceedingFileTypePropertyDeletedAt: null
 */

export default class ProceedingFileTypeProperty extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare proceedingFileTypePropertyId: number

  @column()
  declare proceedingFileTypePropertyName: string

  @column()
  declare proceedingFileTypePropertyType: string

  @column()
  declare proceedingFileTypePropertyCategoryName: string

  @column()
  declare proceedingFileTypeId: number

  @column.dateTime({ autoCreate: true })
  declare proceedingFileTypePropertyCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare proceedingFileTypePropertyUpdatedAt: DateTime

  @column.dateTime({ columnName: 'proceeding_file_type_property_deleted_at' })
  declare deletedAt: DateTime | null
}
