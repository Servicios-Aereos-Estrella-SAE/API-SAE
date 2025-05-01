import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_responsible_employees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('user_responsible_employee_id')

      table.integer('user_id').unsigned().notNullable()
      table.integer('employee_id').unsigned().notNullable()

      table.foreign('user_id').references('users.user_id')
      table
        .foreign('employee_id')
        .references('employees.employee_id')

      table.timestamp('user_responsible_employee_created_at').notNullable()
      table.timestamp('user_responsible_employee_updated_at').notNullable()
      table.timestamp('user_responsible_employee_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
