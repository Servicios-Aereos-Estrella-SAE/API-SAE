import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vacation_settings'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('deleted_at', 'vacation_setting_deleted_at')
    })
  }
  async down() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('vacation_setting_deleted_at', 'deleted_at')
    })
  }
}
