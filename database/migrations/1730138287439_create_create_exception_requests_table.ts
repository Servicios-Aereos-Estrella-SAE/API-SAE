import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exception_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('exception_request_id')
      table.integer('employee_id').unsigned().notNullable().references('employees.employee_id')
      table
        .integer('exception_type_id')
        .unsigned()
        .notNullable()
        .references('exception_types.exception_type_id')
      table
        .enu('exception_request_status', ['requested', 'pending', 'accepted', 'refused'])
        .notNullable()
        .defaultTo('requested')
      table.string('exception_request_description').nullable()
      table.timestamp('exception_request_created_at', { useTz: true }).notNullable()
      table.timestamp('exception_request_updated_at', { useTz: true }).notNullable()
      table.timestamp('exception_request_deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
