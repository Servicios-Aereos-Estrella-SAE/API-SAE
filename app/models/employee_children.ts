/* eslint-disable max-len */
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DateTime } from 'luxon'
/**
 * @swagger
 * components:
 *   schemas:
 *      EmployeeChildren:
 *        type: object
 *        properties:
 *          employeeChildrenId:
 *            type: number
 *            description: Employee children id
 *          employeeChildrenFirstname:
 *            type: string
 *            description: Employee children firstname
 *          employeeChildrenLastname:
 *            type: string
 *            description: Employee children lastname
 *          employeeChildrenSecondLastname:
 *            type: string
 *            description: Employee children second lastname
 *          employeeChildrenGender:
 *            type: string
 *            description: Employee children gender
 *          employeeChildrenBirthday:
 *            type: string
 *            description: Employee children birthday (YYYY-MM-DD)
 *          employeeId:
 *            type: number
 *            description: Employee id
 *          employeeChildrenCreatedAt:
 *            type: string
 *          employeeChildrenUpdatedAt:
 *            type: string
 *          employeeChildrenDeletedAt:
 *            type: string
 *
 */

export default class EmployeeChildren extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare employeeChildrenId: number

  @column()
  declare employeeChildrenFirstname: string

  @column()
  declare employeeChildrenLastname: string

  @column()
  declare employeeChildrenSecondLastname: string

  @column()
  declare employeeChildrenGender: string

  @column()
  declare employeeChildrenBirthday: string

  @column()
  declare employeeId: number

  @column.dateTime({ autoCreate: true })
  declare employeeChildrenCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeChildrenUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_children_deleted_at' })
  declare deletedAt: DateTime | null
}
