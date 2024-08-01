import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vacation_settings'
  async up() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('id', 'vacation_setting_id')
      table.renameColumn('years_of_service', 'vacation_setting_years_of_service')
      table.renameColumn('vacation_days', 'vacation_setting_vacation_days')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('vacation_setting_id', 'id')
      table.renameColumn('vacation_setting_years_of_service', 'years_of_service')
      table.renameColumn('vacation_setting_vacation_days', 'vacation_days')
    })
  }
}
