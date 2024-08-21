import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('system_setting_id')
      table.string('system_setting_trade_name', 150).notNullable()
      table.string('system_setting_logo', 255).nullable()
      table.string('system_setting_sidebar_color', 25).notNullable()
      table.tinyint('system_setting_active').notNullable().defaultTo(1)

      table.timestamp('system_setting_created_at').notNullable()
      table.timestamp('system_setting_updated_at').nullable()
      table.timestamp('system_setting_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
