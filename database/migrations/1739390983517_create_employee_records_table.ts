import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_records'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_record_id').notNullable()

      table.integer('employee_record_property_id').unsigned().notNullable()
      table
        .foreign('employee_record_property_id')
        .references('employee_record_properties.employee_record_property_id')

      table.integer('employee_id').unsigned().notNullable()
      table.foreign('employee_id').references('employees.employee_id')

      table.text('employee_record_value').notNullable
      table.tinyint('employee_record_active').notNullable()

      table.timestamp('employee_record_created_at').notNullable()
      table.timestamp('employee_record_updated_at').nullable()
      table.timestamp('employee_record_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
