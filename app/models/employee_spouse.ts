/* eslint-disable max-len */
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'
/**
 * @swagger
 * components:
 *   schemas:
 *      EmployeeSpouse:
 *        type: object
 *        properties:
 *          employeeSpouseId:
 *            type: number
 *            description: Employee spouse id
 *          employeeSpouseFirstname:
 *            type: string
 *            description: Employee spouse firstname
 *          employeeSpouseLastname:
 *            type: string
 *            description: Employee spouse lastname
 *          employeeSpouseSecondLastname:
 *            type: string
 *            description: Employee spouse second lastname
 *          employeeSpouseOcupation:
 *            type: string
 *            description: Employee spouse ocupation
 *          employeeSpouseBirthday:
 *            type: string
 *            description: Employee spouse birthday (YYYY-MM-DD)
 *          employeeId:
 *            type: number
 *            description: Employee id
 *          employeeSpouseCreatedAt:
 *            type: string
 *          employeeSpouseUpdatedAt:
 *            type: string
 *          employeeSpouseDeletedAt:
 *            type: string
 *
 */

export default class EmployeeSpouse extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare employeeSpouseId: number

  @column()
  declare employeeSpouseFirstname: string

  @column()
  declare employeeSpouseLastname: string

  @column()
  declare employeeSpouseSecondLastname: string

  @column()
  declare employeeSpouseOcupation: string

  @column()
  declare employeeSpouseBirthday: string

  @column()
  declare employeeId: number

  @column.dateTime({ autoCreate: true })
  declare employeeSpouseCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeSpouseUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_spouse_deleted_at' })
  declare deletedAt: DateTime | null
}
