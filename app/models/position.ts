import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

/**
 * @swagger
 * components:
 *   schemas:
 *      Position:
 *        type: object
 *        properties:
 *          position_id:
 *            type: number
 *            description: Id de la posición
 *          position_sync_id:
 *            type: number
 *            description: Id de la posición importada
 *          position_code:
 *            type: string
 *            description: Código de la posición
 *          position_name:
 *            type: string
 *            description: Nombre de la posición
 *          position_is_default:
 *            type: boolean
 *            description: Si la posición es la default
 *          position_active:
 *            type: number
 *            description: Activo o Inactivo
 *          parent_position_id:
 *            type: number
 *            description: Id de la posición relacionado
 *          parent_position_sync_id:
 *            type: number
 *            description: Id de la posicion relacionada importada
 *          company_id:
 *            type: number
 *            description: Id de la compañia
 *          position_last_synchronization_at:
 *            type: string
 *            description: Fecha de última sincronización
 *          position_created_at:
 *            type: string
 *          position_updated_at:
 *            type: string
 *          position_deleted_at:
 *            type: string
 *
 */
export default class Position extends BaseModel {
  @column({ isPrimary: true })
  declare position_id: number

  @column()
  declare position_sync_id: number

  @column()
  declare position_code: string

  @column()
  declare position_name: string

  @column()
  declare position_alias: string

  @column()
  declare position_is_default: boolean

  @column()
  declare position_active: number

  @column()
  declare parent_position_id: number | null

  @column()
  declare parent_position_sync_id: number

  @column()
  declare company_id: number

  @column()
  declare position_last_synchronization_at: Date

  @belongsTo(() => Position, {
    foreignKey: 'parent_position_id',
  })
  declare parent_position: BelongsTo<typeof Position>

  @hasMany(() => Position, {
    foreignKey: 'parent_position_id',
  })
  declare sub_positions: HasMany<typeof Position>

  @belongsTo(() => Position, {
    foreignKey: 'parent_position_sync_id',
  })
  declare parentsyncposition: BelongsTo<typeof Position>

  @hasMany(() => Position, {
    foreignKey: 'parent_position_sync_id',
  })
  declare sub_sync_positions: HasMany<typeof Position>

  @column.dateTime({ autoCreate: true })
  declare position_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare position_updated_at: DateTime

  @column()
  declare position_deleted_at: DateTime | null
}
