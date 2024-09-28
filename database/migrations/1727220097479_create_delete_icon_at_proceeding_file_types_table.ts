import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_file_types'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('proceeding_file_type_icon')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.text('proceeding_file_type_icon', 'longtext').nullable()
    })
  }
}
