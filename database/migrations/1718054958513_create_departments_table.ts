import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'departments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('department_id').notNullable()
      table.string('department_code', 50).notNullable().unique()
      table.string('department_name', 100).notNullable()
      table.boolean('department_is_default').nullable()
      table.tinyint('department_active').nullable()
      table.integer('parent_department_id').unsigned().nullable()
      table.integer('company_id').nullable()
      table.foreign('parent_department_id').references('departments.department_id')

      table.timestamp('department_created_at').notNullable()
      table.timestamp('department_updated_at').nullable()
      table.timestamp('department_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
