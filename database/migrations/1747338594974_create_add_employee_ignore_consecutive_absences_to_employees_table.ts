import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .tinyint('employee_ignore_consecutive_absences').nullable()
        .defaultTo(0)
        .after('employee_business_email')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employee_ignore_consecutive_absences')
    })
  }
}
