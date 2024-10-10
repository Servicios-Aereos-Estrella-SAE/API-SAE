import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vacation_settings'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.date('vacation_setting_apply_since').nullable()
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('vacation_setting_apply_since')
    })
  }
}
