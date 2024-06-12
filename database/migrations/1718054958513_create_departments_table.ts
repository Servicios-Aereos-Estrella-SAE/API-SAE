import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'departments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('department_id').notNullable()
      table.tinyint('department_sync_id').notNullable()
      table.string('department_code', 50).notNullable()
      table.string('department_name', 100).notNullable()
      table.string('department_alias', 250).nullable()
      table.boolean('department_is_default').nullable()
      table.tinyint('department_active').nullable()
      table.integer('parent_department_id').unsigned().nullable()
      table.integer('company_id').nullable()
      table.timestamp('department_last_synchronization_at').nullable()
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
