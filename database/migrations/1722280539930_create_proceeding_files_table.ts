import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('proceeding_file_id')
      table.string('proceeding_file_name', 100).nullable()
      table.string('proceeding_file_path', 250).notNullable()
      table.integer('proceeding_file_type_id').unsigned().notNullable()
      table.timestamp('proceeding_file_expiration_at').nullable()
      table.tinyint('proceeding_file_active').nullable().defaultTo(1)
      table
        .foreign('proceeding_file_type_id')
        .references('proceeding_file_types.proceeding_file_type_id')
      table.timestamp('proceeding_file_created_at').notNullable()
      table.timestamp('proceeding_file_updated_at').notNullable()
      table.timestamp('proceeding_file_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
