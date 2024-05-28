import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('system_permission_id')
      table.string('system_permission_name', 100).notNullable()
      table.string('system_permission_slug', 150).notNullable()
      table.string('system_permission_description', 200).nullable()
      table.integer('system_module_id').unsigned().notNullable()

      table.timestamp('system_permission_created_at').notNullable()
      table.timestamp('system_permission_updated_at').nullable()
      table.timestamp('system_permission_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
