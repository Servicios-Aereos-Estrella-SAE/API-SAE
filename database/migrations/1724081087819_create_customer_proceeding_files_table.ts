import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customer_proceeding_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('customer_proceeding_file_id')
      table.integer('customer_id').unsigned().notNullable()
      table.integer('proceeding_file_id').unsigned().notNullable()
      table.foreign('customer_id').references('customers.customer_id')
      table.foreign('proceeding_file_id').references('proceeding_files.proceeding_file_id')
      table.timestamp('customer_proceeding_file_created_at').notNullable()
      table.timestamp('customer_proceeding_file_updated_at').nullable()
      table.timestamp('customer_proceeding_file_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
