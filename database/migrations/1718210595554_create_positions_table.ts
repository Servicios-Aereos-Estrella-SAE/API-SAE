import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'positions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('position_id').notNullable()
      table.integer('position_sync_id').notNullable()
      table.string('position_code', 50).notNullable()
      table.string('position_name', 100).notNullable()
      table.string('position_alias', 250).nullable()
      table.boolean('position_is_default').nullable()
      table.tinyint('position_active').nullable()
      table.integer('parent_position_id').unsigned().nullable()
      table.integer('parent_position_sync_id').nullable()
      table.integer('company_id').nullable()
      table.timestamp('position_last_synchronization_at').nullable()
      table.foreign('parent_position_id').references('positions.position_id')

      table.timestamp('position_created_at').notNullable()
      table.timestamp('position_updated_at').nullable()
      table.timestamp('position_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
