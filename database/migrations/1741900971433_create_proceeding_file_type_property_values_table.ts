import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_file_type_property_values'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('proceeding_file_type_property_value_id').notNullable()

      table.integer('proceeding_file_type_property_id').unsigned().notNullable()
      table
        .foreign('proceeding_file_type_property_id', 'pf_type_property_fk')
        .references('proceeding_file_type_properties.proceeding_file_type_property_id')

      table.integer('proceeding_file_id').unsigned().notNullable()
      table.foreign('proceeding_file_id').references('proceeding_files.proceeding_file_id')

      table.integer('employee_id').unsigned().notNullable()
      table.foreign('employee_id').references('employees.employee_id')

      table.text('proceeding_file_type_property_value_value').notNullable
      table.tinyint('proceeding_file_type_property_value_active').notNullable()

      table.timestamp('proceeding_file_type_property_value_created_at').notNullable()
      table.timestamp('proceeding_file_type_property_value_updated_at').nullable()
      table.timestamp('proceeding_file_type_property_value_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
