import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pilot_proceeding_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('pilot_proceeding_file_id')
      table.integer('pilot_id').unsigned().notNullable()
      table.integer('proceeding_file_id').unsigned().notNullable()
      table.foreign('pilot_id').references('pilots.pilot_id')
      table.foreign('proceeding_file_id').references('proceeding_files.proceeding_file_id')
      table.timestamp('pilot_proceeding_file_created_at').notNullable()
      table.timestamp('pilot_proceeding_file_updated_at').nullable()
      table.timestamp('pilot_proceeding_file_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
