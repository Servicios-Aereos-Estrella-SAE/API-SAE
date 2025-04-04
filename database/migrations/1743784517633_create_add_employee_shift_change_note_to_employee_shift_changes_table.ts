import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_shift_changes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .text('employee_shift_change_note', 'longtext')
        .after('employee_shift_change_change_this_shift')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employee_shift_change_note')
    })
  }
}
