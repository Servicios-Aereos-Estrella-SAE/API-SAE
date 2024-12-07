import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_type_id')
      table.string('employee_type_name', 100).notNullable
      table.string('employee_type_slug', 250).nullable()
      table
        .integer('business_unit_id')
        .unsigned()
        .references('business_unit_id')
        .inTable('business_units')
        .defaultTo(1)
      table.timestamp('employee_type_created_at').notNullable
      table.timestamp('employee_type_updated_at').notNullable
      table.timestamp('employee_type_deleted_at').nullable
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
