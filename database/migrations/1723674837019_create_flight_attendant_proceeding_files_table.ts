import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'flight_attendant_proceeding_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('flight_attendant_proceeding_file_id')
      table.integer('flight_attendant_id').unsigned().notNullable()
      table.integer('proceeding_file_id').unsigned().notNullable()
      table.foreign('flight_attendant_id').references('flight_attendants.flight_attendant_id')
      table.foreign('proceeding_file_id').references('proceeding_files.proceeding_file_id')
      table.timestamp('flight_attendant_proceeding_file_created_at').notNullable()
      table.timestamp('flight_attendant_proceeding_file_updated_at').nullable()
      table.timestamp('flight_attendant_proceeding_file_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
