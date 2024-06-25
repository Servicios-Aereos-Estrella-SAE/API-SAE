import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'status_syncs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('date_request_sync').notNullable()
      table.timestamp('date_time_start_sync').notNullable()
      table.enum('status_sync', ['in_process', 'success', 'failed']).defaultTo('in_process')
      table.integer('page_total_sync').notNullable()
      table.integer('items_total_sync').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
