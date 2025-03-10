import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import EmployeeContractType from './employee_contract_type.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Department from './department.js'
import Position from './position.js'
import BusinessUnit from './business_unit.js'
/**
 * @swagger
 * components:
 *   schemas:
 *      EmployeeContract:
 *        type: object
 *        properties:
 *          employeeContractId:
 *            type: number
 *            description: Employee contract ID
 *          employeeContractUuid:
 *            type: string
 *            description: Employee contract uuid
 *          employeeContractFolio:
 *            type: string
 *            description: Employee contract folio
 *          employeeContractStartDate:
 *           type: string
 *           format: date
 *           description: Employee contract start date
 *          employeeContractEndDate:
 *           type: string
 *           format: date
 *           description: Employee contract end date
 *          employeeContractStatus:
 *            type: string
 *            description: Employee contract status
 *            enum: [active, expired, cancelled]
 *          employeeContractMonthlyNetSalary:
 *           type: number
 *           description: Employee contract monthly net salary
 *          employeeContractFile:
 *           type: string
 *           description: Employee contract file
 *          employeeContractTypeId:
 *            type: number
 *            description: Employee contract type id
 *          employeeId:
 *            type: number
 *            description: Employee id
 *          departmentId:
 *            type: number
 *            description: Department id
 *          positionId:
 *            type: number
 *            description: Position id
 *          payrollBusinessUnitId:
 *            type: number
 *            description: payroll business unit id
 *          employeeContractCreatedAt:
 *            type: string
 *            format: date-time
 *          employeeContractUpdatedAt:
 *            type: string
 *            format: date-time
 *          employeeContractDeletedAt:
 *            type: string
 *            format: date-time
 *            nullable: true
 */
export default class EmployeeContract extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare employeeContractId: number

  @column()
  declare employeeContractUuid: string

  @column()
  declare employeeContractFolio: string

  @column()
  declare employeeContractStartDate: string

  @column()
  declare employeeContractEndDate: string

  @column()
  declare employeeContractStatus: string

  @column()
  declare employeeContractMonthlyNetSalary: number

  @column()
  declare employeeContractFile: string

  @column()
  declare employeeContractTypeId: number

  @column()
  declare employeeId: number

  @column()
  declare departmentId: number

  @column()
  declare positionId: number

  @column()
  declare payrollBusinessUnitId: number

  @column.dateTime({ autoCreate: true })
  declare employeeContractCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeContractUpdatedAt: DateTime

  @column.dateTime({ columnName: 'employee_contract_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => EmployeeContractType, {
    foreignKey: 'employeeContractTypeId',
  })
  declare employeeContractType: BelongsTo<typeof EmployeeContractType>

  @belongsTo(() => Department, {
    foreignKey: 'departmentId',
  })
  declare department: BelongsTo<typeof Department>

  @belongsTo(() => Position, {
    foreignKey: 'positionId',
  })
  declare position: BelongsTo<typeof Position>

  @belongsTo(() => BusinessUnit, {
    foreignKey: 'payrollBusinessUnitId',
  })
  declare payrollBusinessUnit: BelongsTo<typeof BusinessUnit>
}
