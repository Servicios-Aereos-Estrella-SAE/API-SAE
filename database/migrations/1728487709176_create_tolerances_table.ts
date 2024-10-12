import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tolerances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tolerance_id')
      table.string('tolerance_name', 255).notNullable()
      table.integer('tolerance_minutes').defaultTo(0)
      table.timestamp('tolerance_created_at').notNullable()
      table.timestamp('tolerance_updated_at').nullable()
      table.timestamp('tolerance_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
