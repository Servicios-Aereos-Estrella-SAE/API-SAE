import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'page_syncs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('status_sync_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('status_syncs')
        .onDelete('CASCADE')
      table.integer('page_number').notNullable()
      table.enum('page_status', ['pending', 'sync']).defaultTo('pending')
      table.integer('items_count').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
