import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_banks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('employee_bank_account_number_last_numbers', 4).nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('employee_bank_account_number_last_numbers', 4).notNullable()
    })
  }
}
