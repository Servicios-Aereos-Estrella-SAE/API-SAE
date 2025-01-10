import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircraft_pilots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('aircraft_pilot_id')
      table
        .integer('aircraft_id')
        .unsigned()
        .references('aircraft_id')
        .inTable('aircrafts')
        .onDelete('CASCADE')

      table
        .integer('pilot_id')
        .unsigned()
        .references('pilot_id')
        .inTable('pilots')
        .onDelete('CASCADE')

      table.enum('aircraft_pilot_role', ['pic', 'sic']).notNullable().defaultTo('pic')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
