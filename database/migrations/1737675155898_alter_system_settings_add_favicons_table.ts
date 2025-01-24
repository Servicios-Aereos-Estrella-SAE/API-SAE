import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('system_setting_favicon').after('system_setting_banner')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('system_setting_favicon')
    })
  }
}
