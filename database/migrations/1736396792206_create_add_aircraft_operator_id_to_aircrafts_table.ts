import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircrafts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('aircraft_operator_id')
        .unsigned()
        .references('aircraft_operator_id')
        .inTable('aircraft_operators')
        .nullable()
        .after('airport_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('aircraft_operator_id')
      table.dropColumn('aircraft_operator_id')
    })
  }
}
