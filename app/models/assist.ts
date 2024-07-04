import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
/**
 * @swagger
 * components:
 *   schemas:
 *     Assist:
 *      type: object
 *      properties:
 *        assistId:
 *          type: integer
 *        assistEmpCode:
 *          type: string
 *        assistTerminalSn:
 *          type: string
 *        assistTerminalAlias:
 *          type: string
 *        assistAreaAlias:
 *          type: string
 *        assistLongitude:
 *          type: number
 *          format: float
 *        assistLatitude:
 *          type: number
 *          format: float
 *        assistUploadTime:
 *          type: string
 *          format: date-time
 *        assistEmpId:
 *          type: integer
 *        assistTerminalId:
 *          type: integer
 *        assistSyncId:
 *          type: integer
 *        assistPunchTime:
 *          type: string
 *          format: date-time
 *        assistPunchTimeUtc:
 *          type: string
 *          format: date-time
 *        assistPunchTimeOrigin:
 *          type: string
 *          format: date-time
 *        assistCreatedAt:
 *          type: string
 *          format: date-time
 *        assistUpdatedAt:
 *          type: string
 *          format: date-time
 */
export default class Assist extends BaseModel {
  @column({ isPrimary: true })
  declare assistId: number

  @column()
  declare assistEmpCode: string

  @column()
  declare assistTerminalSn: string

  @column()
  declare assistTerminalAlias: string

  @column()
  declare assistAreaAlias: string

  @column()
  declare assistLongitude: number

  @column()
  declare assistLatitude: number

  @column.dateTime({ autoCreate: true })
  declare assistUploadTime: DateTime

  @column()
  declare assistEmpId: number

  @column()
  declare assistTerminalId: number

  @column()
  declare assistSyncId: number

  @column.dateTime({ autoCreate: true })
  declare assistPunchTime: DateTime

  @column.dateTime({ autoCreate: true })
  declare assistPunchTimeUtc: DateTime

  @column.dateTime({ autoCreate: true })
  declare assistPunchTimeOrigin: DateTime

  @column.dateTime({ autoCreate: true })
  declare assistCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare assistUpdatedAt: DateTime
}
