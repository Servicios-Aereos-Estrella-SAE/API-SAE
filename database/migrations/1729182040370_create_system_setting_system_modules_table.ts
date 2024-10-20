import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_setting_system_modules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('system_setting_system_module_id')
      table.integer('system_setting_id').unsigned().notNullable()
      table.integer('system_module_id').unsigned().notNullable()
      table.foreign('system_setting_id').references('system_settings.system_setting_id')
      table.foreign('system_module_id').references('system_modules.system_module_id')

      table.timestamp('system_setting_system_module_created_at').notNullable()
      table.timestamp('system_setting_system_module_updated_at').nullable()
      table.timestamp('system_setting_system_module_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
