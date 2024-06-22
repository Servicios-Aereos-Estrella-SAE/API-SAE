import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
/**
 * @swagger
 * components:
 *   schemas:
 *     Holiday:
 *       type: object
 *       properties:
 *         holidayId:
 *           type: number
 *           description: Holiday ID
 *         holidayName:
 *           type: string
 *           description: Name of the holiday
 *         holidayDate:
 *           type: string
 *           format: date
 *           description: Date of the holiday
 *         holidayIcon:
 *           type: string
 *           description: Icon representing the holiday
 *         holidayCreatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the holiday was created
 *         holidayUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the holiday was last updated
 *         holidayDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the holiday was soft-deleted
 *       example:
 *         holidayId: 1
 *         holidayName: "Christmas Day"
 *         holidayDate: "2024-12-25"
 *         holidayIcon: "icon_christmas"
 *         holidayCreatedAt: '2024-06-20T12:00:00Z'
 *         holidayUpdatedAt: '2024-06-20T13:00:00Z'
 *         holidayDeletedAt: null
 */
export default class Holiday extends BaseModel {
  @column({ isPrimary: true })
  declare holidayId: number

  @column()
  declare holidayName: string

  @column()
  declare holidayDate: string

  @column()
  declare holidayIcon: string

  @column.dateTime({ autoCreate: true })
  declare holidayCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare holidayUpdatedAt: DateTime

  @column.dateTime()
  declare holidayDeletedAt: DateTime
}
