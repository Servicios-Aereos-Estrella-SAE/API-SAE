/* eslint-disable max-len */
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'
import Bank from './bank.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
/**
 * @swagger
 * components:
 *   schemas:
 *      EmployeeBank:
 *        type: object
 *        properties:
 *          employeeBankId:
 *            type: number
 *            description: Employee bank id
 *          employeeBankAccountClabe:
 *            type: string
 *            description: Employee bank account clabe
 *          employeeBankAccountClabeLastNumbers:
 *            type: string
 *            description: Employee bank account clabe last 4 numbers
 *          employeeBankAccountNumber:
 *            type: string
 *            description: Employee bank account number
 *          employeeBankAccountNumberLastNumbers:
 *            type: string
 *            description: Employee bank account number last 4 numbers
 *          employeeBankAccountCardNumber:
 *            type: string
 *            description: Employee bank account card number
 *          employeeBankAccountCardNumberLastNumbers:
 *            type: string
 *            description: Employee bank account card number last 4 numbers
 *          employeeBankAccountType:
 *            type: string
 *            description: Employee bank account type
 *          employeeBankAccountCurrencyType:
 *            type: string
 *            description: Employee bank account currency type
 *          employeeId:
 *            type: number
 *            description: Employee id
 *          bankId:
 *            type: number
 *            description: Bank id
 *          employeeBankCreatedAt:
 *            type: string
 *          employeeBankUpdatedAt:
 *            type: string
 *          employeeBankDeletedAt:
 *            type: string
 *
 */

export default class EmployeeBank extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare employeeBankId: number

  @column()
  declare employeeBankAccountClabe: string

  @column()
  declare employeeBankAccountClabeLastNumbers: string

  @column()
  declare employeeBankAccountNumber: string

  @column()
  declare employeeBankAccountNumberLastNumbers: string

  @column()
  declare employeeBankAccountCardNumber: string

  @column()
  declare employeeBankAccountCardNumberLastNumbers: string

  @column()
  declare employeeBankAccountType: string

  @column()
  declare employeeBankAccountCurrencyType: string

  @column()
  declare employeeId: number

  @column()
  declare bankId: number

  @column.dateTime({ autoCreate: true })
  declare employeeBankCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeBankUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_bank_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Bank, {
    foreignKey: 'bankId',
  })
  declare bank: BelongsTo<typeof Bank>
}
