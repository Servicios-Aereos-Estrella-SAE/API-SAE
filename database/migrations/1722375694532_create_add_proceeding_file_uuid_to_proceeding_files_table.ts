import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_files'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('proceeding_file_uuid', 100).notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('proceeding_file_uuid')
    })
  }
}
