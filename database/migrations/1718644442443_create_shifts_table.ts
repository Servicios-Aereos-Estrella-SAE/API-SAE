import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shifts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('shift_id')
      table.string('shift_name', 100).nullable()
      table.integer('shift_day_start').nullable()
      table.time('shift_time_start').nullable()
      table.integer('shift_active_hours').nullable()
      table.string('shift_rest_days', 5).nullable()
      table.timestamp('shift_created_at').notNullable()
      table.timestamp('shift_updated_at').nullable()
      table.timestamp('shift_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
