import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_file_has_status'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('proceeding_file_has_status_id')
      table.integer('proceeding_file_id').unsigned().notNullable()
      table.integer('proceeding_file_status_id').unsigned().notNullable()
      table.foreign('proceeding_file_id').references('proceeding_files.proceeding_file_id')
      table
        .foreign('proceeding_file_status_id')
        .references('proceeding_file_status.proceeding_file_status_id')

      table.timestamp('proceeding_file_has_status_created_at').notNullable()
      table.timestamp('proceeding_file_has_status_updated_at').nullable()
      table.timestamp('proceeding_file_has_status_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
