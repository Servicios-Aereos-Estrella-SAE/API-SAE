import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_address'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_address_id')
      table.integer('employee_id').unsigned().notNullable()
      table.integer('address_id').unsigned().notNullable()
      table.foreign('employee_id').references('employees.employee_id')
      table.foreign('address_id').references('addresses.address_id')
      table.timestamp('employee_address_created_at').notNullable()
      table.timestamp('employee_address_updated_at').nullable()
      table.timestamp('employee_address_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
