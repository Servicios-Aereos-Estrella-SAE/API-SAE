import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_contract_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_contract_type_id')
      table.string('employee_contract_type_name', 100).notNullable
      table.text('employee_contract_type_description').nullable()
      table.string('employee_contract_type_slug', 250).notNullable()

      table.timestamp('employee_contract_type_created_at').notNullable
      table.timestamp('employee_contract_type_updated_at').notNullable
      table.timestamp('employee_contract_type_deleted_at').nullable
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
