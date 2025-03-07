/* eslint-disable max-len */
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'
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
 *          employeeBankAccountType:
 *            type: string
 *            description: Employee bank account type
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
  declare employeeBankAccountType: string

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
}
