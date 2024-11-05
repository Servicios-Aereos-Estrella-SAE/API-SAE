import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_file_type_emails'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('proceeding_file_type_email_id')
      table.integer('proceeding_file_type_id').unsigned().notNullable()
      table.string('proceeding_file_type_email_email', 200).notNullable()
      table
        .foreign('proceeding_file_type_id')
        .references('proceeding_file_types.proceeding_file_type_id')

      table.timestamp('proceeding_file_type_email_created_at').notNullable()
      table.timestamp('proceeding_file_type_email_updated_at').nullable()
      table.timestamp('proceeding_file_type_email_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
