import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vacation_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .tinyint('vacation_setting_crew')
        .after('vacation_setting_vacation_days')
        .nullable()
        .defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('vacation_setting_crew')
    })
  }
}
