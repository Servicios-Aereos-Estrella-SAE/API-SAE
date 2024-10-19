import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_file_types'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('parent_id')
        .unsigned()
        .references('proceeding_file_type_id')
        .inTable('proceeding_file_types')
        .nullable()
        .after('proceeding_file_type_active')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('parent_id')
      table.dropColumn('parent_id')
    })
  }
}
