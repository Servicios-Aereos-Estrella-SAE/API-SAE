import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_banks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_bank_id')
      table.string('employee_bank_account_clabe', 250).notNullable()
      table.string('employee_bank_account_clabe_last_numbers', 4).notNullable()
      table.string('employee_bank_account_number', 250).notNullable()
      table.string('employee_bank_account_number_last_numbers', 4).notNullable()
      table.string('employee_bank_account_type', 50).nullable()

      table.integer('employee_id').unsigned().notNullable()
      table.integer('bank_id').unsigned().notNullable()
      table.foreign('employee_id').references('employees.employee_id')
      table.foreign('bank_id').references('banks.bank_id')

      table.timestamp('employee_bank_created_at').notNullable()
      table.timestamp('employee_bank_updated_at')
      table.timestamp('employee_bank_deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
