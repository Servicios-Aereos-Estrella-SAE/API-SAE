import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_file_status'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('proceeding_file_status_id')
      table.string('proceeding_file_status_name', 100).notNullable()
      table.string('proceeding_file_status_slug', 250).notNullable()
      table.timestamp('proceeding_file_status_created_at').notNullable()
      table.timestamp('proceeding_file_status_updated_at').notNullable()
      table.timestamp('proceeding_file_status_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
