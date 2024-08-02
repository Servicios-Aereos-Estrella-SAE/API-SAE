import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircraft_classes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('aircraft_class_id')
      table.string('aircraft_class_banner')
      table.text('aircraft_class_long_description')
      table.string('aircraft_class_short_description', 512).notNullable()
      table.string('aircraft_class_name').notNullable()
      table.string('aircraft_class_slug')
      table.tinyint('aircraft_class_status').notNullable().defaultTo(1)
      table
        .timestamp('aircraft_class_created_at', { useTz: true })
        .notNullable()
        .defaultTo(this.now())
      table
        .timestamp('aircraft_class_updated_at', { useTz: true })
        .notNullable()
        .defaultTo(this.now())
      table.timestamp('aircraft_class_deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
