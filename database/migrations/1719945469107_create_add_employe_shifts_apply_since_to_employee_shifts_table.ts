import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddEmployeShiftsApplySinceToEmployeeShifts extends BaseSchema {
  protected tableName = 'employee_shifts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.date('employe_shifts_apply_since')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employe_shifts_apply_since')
    })
  }
}
