import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_id').notNullable()
      table.integer('employee_sync_id').notNullable()
      table.integer('status').notNullable()
      table.integer('empCode').notNullable()

      table.timestamp('employee_last_synchronization_at').nullable()
      table.foreign('department_id').references('departments.department_id')

      table.timestamp('employee_created_at').notNullable()
      table.timestamp('employee_updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
