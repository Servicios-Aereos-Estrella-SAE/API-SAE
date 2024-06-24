import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Assist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare empCode: string

  @column()
  declare terminalSn: string

  @column()
  declare terminalAlias: string

  @column()
  declare areaAlias: string

  @column()
  declare longitude: number

  @column()
  declare latitude: number

  @column.dateTime({ autoCreate: true })
  declare uploadTime: DateTime

  @column()
  declare empId: number

  @column()
  declare terminalId: number

  @column()
  declare assistSyncId: number

  @column.dateTime({ autoCreate: true })
  declare punchTime: DateTime

  @column.dateTime({ autoCreate: true })
  declare punchTimeUtc: DateTime

  @column.dateTime({ autoCreate: true })
  declare punchTimeOrigin: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
