import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('system_setting_tolerance_count_per_absence').after('system_setting_business_units').nullable().defaultTo(3)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('system_setting_tolerance_count_per_absence')
    })
  }
}
