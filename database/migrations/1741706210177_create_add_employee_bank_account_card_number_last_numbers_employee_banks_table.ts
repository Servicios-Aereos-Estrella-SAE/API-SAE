import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_banks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('employee_bank_account_card_number_last_numbers', 250)
        .after('employee_bank_account_card_number')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employee_bank_account_card_number_last_numbers')
    })
  }
}
