import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_spouses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_spouse_id')
      table.string('employee_spouse_firstname', 150).notNullable()
      table.string('employee_spouse_lastname', 150).notNullable()
      table.string('employee_spouse_second_lastname', 150).notNullable()
      table.string('employee_spouse_ocupation', 150).nullable()
      table.date('employee_spouse_birthday').nullable()
      table.integer('employee_id').unsigned().notNullable()
      table.foreign('employee_id').references('employees.employee_id')

      table.timestamp('employee_spouse_created_at').notNullable()
      table.timestamp('employee_spouse_updated_at')
      table.timestamp('employee_spouse_deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
