import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

/**
 * @swagger
 * components:
 *   schemas:
 *      Department:
 *        type: object
 *        properties:
 *          department_id:
 *            type: number
 *            description: Id del departamento
 *          department_sync_id:
 *            type: number
 *            description: Id del departamento importado
 *          department_code:
 *            type: string
 *            description: Código del departamento
 *          department_name:
 *            type: string
 *            description: Nombre del departamento
 *          department_is_default:
 *            type: boolean
 *            description: Si el departemento es el default
 *          department_active:
 *            type: number
 *            description: Activo o Inactivo
 *          parent_department_id:
 *            type: number
 *            description: Id del departamento relacionado
 *          company_id:
 *            type: number
 *            description: Id de la compañia
 *          department_created_at:
 *            type: string
 *          department_updated_at:
 *            type: string
 *          department_deleted_at:
 *            type: string
 *
 */
export default class Department extends BaseModel {
  @column({ isPrimary: true })
  declare department_id: number

  @column()
  declare department_sync_id: number

  @column()
  declare department_code: string

  @column()
  declare department_name: string

  @column()
  declare department_alias: string

  @column()
  declare department_is_default: boolean

  @column()
  declare department_active: number

  @column()
  declare parent_department_id: number

  @column()
  declare company_id: number

  @column()
  declare department_last_synchronization_at: Date

  @belongsTo(() => Department, {
    foreignKey: 'parent_department_id',
  })
  declare parentDepartment: BelongsTo<typeof Department>

  @hasMany(() => Department, {
    foreignKey: 'parent_department_id',
  })
  declare subDepartments: HasMany<typeof Department>

  @column.dateTime({ autoCreate: true })
  declare department_created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare department_updated_at: DateTime

  @column()
  declare department_deleted_at: DateTime | null
}
