import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import ProceedingFile from './proceeding_file.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Employee from './employee.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      EmployeeProceedingFile:
 *        type: object
 *        properties:
 *          employeeProceedingFileId:
 *            type: number
 *            description: Employee proceeding file id
 *          employeeId:
 *            type: number
 *            description: Employee id
 *          proceedingFileId:
 *            type: number
 *            description: Proceeding file id
 *          employeeProceedingFileCreatedAt:
 *            type: string
 *          employeeProceedingFileUpdatedAt:
 *            type: string
 *          employeeProceedingFileDeletedAt:
 *            type: string
 *
 */
export default class EmployeeProceedingFile extends compose(BaseModel, SoftDeletes) {
  static table = 'employee_proceeding_files'

  @column({ isPrimary: true })
  declare employeeProceedingFileId: number

  @column()
  declare employeeId: number

  @column()
  declare proceedingFileId: number

  @column.dateTime({ autoCreate: true })
  declare employeeProceedingFileCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeProceedingFileUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_proceeding_file_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Employee, {
    foreignKey: 'employeeId',
  })
  declare employee: BelongsTo<typeof Employee>

  @belongsTo(() => ProceedingFile, {
    foreignKey: 'proceedingFileId',
  })
  declare proceedingFile: BelongsTo<typeof ProceedingFile>
}
