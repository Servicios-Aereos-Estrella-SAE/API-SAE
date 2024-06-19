import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employees'
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_id').notNullable()
      table.integer('employee_sync_id').notNullable()
      table.string('employee_code', 50).notNullable()
      table.string('employee_first_name', 25).nullable()
      table.string('employee_last_name', 25).nullable()
      table.string('employee_payroll_num', 50).nullable()
      table.timestamp('employee_hire_date').nullable()
      table.integer('company_id').unsigned().notNullable()
      table.integer('department_id').unsigned().notNullable()
      table.integer('position_id').unsigned().notNullable()
      table.integer('department_sync_id').nullable()
      table.integer('position_sync_id').nullable()
      table.timestamp('employee_last_synchronization_at').nullable()
      table.foreign('department_id').references('departments.department_id')
      table.foreign('position_id').references('positions.position_id')

      table.timestamp('employee_created_at').notNullable()
      table.timestamp('employee_updated_at').nullable()
      table.timestamp('employee_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
