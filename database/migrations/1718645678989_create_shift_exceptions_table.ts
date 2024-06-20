import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shift_exceptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('shift_exception_id')
      table
        .integer('employee_id')
        .unsigned()
        .references('employee_id')
        .inTable('employees')
        .onDelete('CASCADE')
      table
        .integer('exception_type_id')
        .unsigned()
        .references('exception_type_id')
        .inTable('exception_types')
        .onDelete('CASCADE')
      table.date('shift_exceptions_date').nullable()
      table.text('shift_exceptions_description').nullable()
      table.timestamp('shift_exceptions_created_at').notNullable()
      table.timestamp('shift_exceptions_updated_at').nullable()
      table.timestamp('shift_exceptions_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
