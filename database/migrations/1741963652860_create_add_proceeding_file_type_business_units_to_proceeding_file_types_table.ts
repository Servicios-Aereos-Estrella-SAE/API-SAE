import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_file_types'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('proceeding_file_type_business_units', 255)
        .after('proceeding_file_type_active')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('proceeding_file_type_business_units')
    })
  }
}
