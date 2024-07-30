import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_file_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('proceeding_file_type_id')
      table.string('proceeding_file_type_name', 100).notNullable()
      table.text('proceeding_file_type_icon', 'longtext').nullable()
      table.string('proceeding_file_type_slug', 250).notNullable()
      table.string('proceeding_file_type_area_to_use', 100).notNullable()
      table.tinyint('proceeding_file_type_active').nullable().defaultTo(1)
      table.timestamp('proceeding_file_type_created_at').notNullable()
      table.timestamp('proceeding_file_type_updated_at').notNullable()
      table.timestamp('proceeding_file_type_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
