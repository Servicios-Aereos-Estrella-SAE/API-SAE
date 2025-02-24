import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Employee from './employee.js'
import Address from './address.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      EmployeeAddress:
 *        type: object
 *        properties:
 *          employeeAddressId:
 *            type: number
 *            description: Employee address id
 *          employeeId:
 *            type: number
 *            description: Employee id
 *          addressId:
 *            type: number
 *            description: Address id
 *          employeeAddressCreatedAt:
 *            type: string
 *          employeeAddressUpdatedAt:
 *            type: string
 *          employeeAddressDeletedAt:
 *            type: string
 *
 */
export default class EmployeeAddress extends compose(BaseModel, SoftDeletes) {
  static table = 'employee_address'

  @column({ isPrimary: true })
  declare employeeAddressId: number

  @column()
  declare employeeId: number

  @column()
  declare addressId: number

  @column.dateTime({ autoCreate: true })
  declare employeeAddressCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeAddressUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_address_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Employee, {
    foreignKey: 'employeeId',
  })
  declare employee: BelongsTo<typeof Employee>

  @belongsTo(() => Address, {
    foreignKey: 'addressId',
  })
  declare address: BelongsTo<typeof Address>
}
