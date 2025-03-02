import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_contracts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_contract_id')
      table.string('employee_contract_uuid', 250).notNullable
      table.string('employee_contract_folio', 100).notNullable()
      table.timestamp('employee_contract_start_date').notNullable()
      table.timestamp('employee_contract_end_date').nullable()
      table.enum('employee_contract_status', ['active', 'expired', 'cancelled']).defaultTo('active')
      table.double('employee_contract_monthly_net_salary', 10, 2).notNullable().defaultTo(0)
      table.string('employee_contract_file', 255).notNullable()

      table.integer('employee_contract_type_id').unsigned().notNullable()
      table.integer('employee_id').unsigned().notNullable()
      table
        .foreign('employee_contract_type_id')
        .references('employee_contract_types.employee_contract_type_id')
      table.foreign('employee_id').references('employees.employee_id')

      table.timestamp('employee_contract_created_at').notNullable
      table.timestamp('employee_contract_updated_at').notNullable
      table.timestamp('employee_contract_deleted_at').nullable
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
