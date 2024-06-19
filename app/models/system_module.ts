import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

/**
 * @swagger
 * components:
 *   schemas:
 *      SystemModule:
 *        type: object
 *        properties:
 *          systemModuleId:
 *            type: number
 *            description: System module id
 *          systemModuleName:
 *            type: string
 *            description: System module name
 *          systemModuleSlug:
 *            type: string
 *            description: System module slug
 *          systemModuleDescription:
 *            type: string
 *            description: System module description
 *          systemModules:
 *            type: string
 *            description: System module order
 *          systemModulePath:
 *            type: string
 *            description: System module path
 *          systemModuleGroup:
 *            type: string
 *            description: System module group
 *          systemModuleActive:
 *            type: number
 *            description: System module status
 *          systemModuleIcon:
 *            type: string
 *            description: System module icon path
 *          systemModuleCreatedAt:
 *            type: string
 *          systemModuleUpdatedAt:
 *            type: string
 *          systemModuleDeletedAt:
 *            type: string
 *
 */

export default class SystemModule extends BaseModel {
  @column({ isPrimary: true })
  declare systemModuleId: number

  @column()
  declare systemModuleName: string

  @column()
  declare systemModuleSlug: string

  @column()
  declare systemModuleDescription: string

  @column()
  declare systemModules: string

  @column()
  declare systemModulePath: string

  @column()
  declare systemModuleGroup: string

  @column()
  declare systemModuleActive: number

  @column()
  declare systemModuleIcon: string

  @column.dateTime({ autoCreate: true })
  declare systemModuleCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare systemModuleUpdatedAt: DateTime

  @column()
  declare systemModuleDeletedAt: DateTime | null
}
