import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_modules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('system_module_id')
      table.string('system_module_name', 45).notNullable()
      table.string('system_module_slug', 45).notNullable()
      table.string('system_module_description', 200).nullable()
      table.tinyint('system_modules').notNullable()
      table.string('system_module_path', 100).notNullable()
      table.string('system_module_group', 45).notNullable()
      table.tinyint('system_module_active').notNullable()
      table.text('system_module_icon').notNullable()

      table.timestamp('system_module_created_at').notNullable()
      table.timestamp('system_module_updated_at').nullable()
      table.timestamp('system_module_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
