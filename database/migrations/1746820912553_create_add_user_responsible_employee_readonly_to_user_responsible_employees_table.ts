import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_responsible_employees'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .tinyint('user_responsible_employee_readonly')
        .after('employee_id')
        .nullable()
        .defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_responsible_employee_readonly')
    })
  }
}
