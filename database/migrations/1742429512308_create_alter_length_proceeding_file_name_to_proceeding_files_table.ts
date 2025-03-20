import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_files'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('proceeding_file_name', 250).nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('proceeding_file_name', 100).nullable().alter()
    })
  }
}
