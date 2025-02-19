import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_children'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_children_id')
      table.string('employee_children_firstname', 150).notNullable()
      table.string('employee_children_lastname', 150).notNullable()
      table.string('employee_children_second_lastname', 150).notNullable()
      table.string('employee_children_gender', 10).nullable()
      table.date('employee_children_birthday').nullable()
      table.integer('employee_id').unsigned().notNullable()
      table.foreign('employee_id').references('employees.employee_id')

      table.timestamp('employee_children_created_at').notNullable()
      table.timestamp('employee_children_updated_at')
      table.timestamp('employee_children_deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
