import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_departments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('role_department_id')
      table.integer('role_id').unsigned().notNullable()
      table.integer('department_id').unsigned().notNullable()
      table.foreign('role_id').references('roles.role_id')
      table.foreign('department_id').references('departments.department_id')

      table.timestamp('role_department_created_at').notNullable()
      table.timestamp('role_department_updated_at').nullable()
      table.timestamp('role_department_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
