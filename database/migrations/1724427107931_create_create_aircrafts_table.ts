import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircrafts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('aircraft_id')
      table.string('aircraft_registration_number').notNullable()
      table.string('aircraft_serial_number').notNullable()
      table
        .integer('airport_id')
        .unsigned()
        .references('airport_id')
        .inTable('airports')
        .onDelete('CASCADE')
      table
        .integer('aircraft_properties_id')
        .unsigned()
        .references('aircraft_properties_id')
        .inTable('aircraft_properties')
        .onDelete('CASCADE')
      table.integer('aircraft_active').defaultTo(1)
      table.timestamp('aircraft_created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('aircraft_updated_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('aircraft_deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
