import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('emp_code').notNullable()
      table.timestamp('punch_time').notNullable()
      table.timestamp('punch_time_utc').notNullable()
      table.timestamp('punch_time_origin').notNullable()
      table.string('terminal_sn').notNullable()
      table.string('terminal_alias').nullable()
      table.string('area_alias').nullable()
      table.decimal('longitude', 10, 7).nullable()
      table.decimal('latitude', 10, 7).nullable()
      table.timestamp('upload_time').notNullable()
      table.integer('emp_id').unsigned().notNullable()
      table.integer('terminal_id').unsigned().nullable()
      table.integer('assist_sync_id').unsigned().notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
