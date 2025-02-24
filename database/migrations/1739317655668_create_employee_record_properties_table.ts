import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_record_properties'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_record_property_id')
      table.string('employee_record_property_name', 100).notNullable
      table.string('employee_record_property_type', 30).notNullable
      table.string('employee_record_property_category_name', 100).notNullable

      table.timestamp('employee_record_property_created_at').notNullable
      table.timestamp('employee_record_property_updated_at').notNullable
      table.timestamp('employee_record_property_deleted_at').nullable
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
