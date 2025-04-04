import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_shift_changes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .tinyint('employee_shift_change_change_this_shift')
        .after('employee_shift_change_date_to_is_rest_day')
        .notNullable()
        .defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employee_shift_change_change_this_shift')
    })
  }
}
