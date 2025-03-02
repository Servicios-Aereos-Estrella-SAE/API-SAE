import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircraft_maintenances'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .timestamp('aircraft_maintenance_finish_date')
        .after('aircraft_maintenance_end_date')
        .nullable()
        .defaultTo(null)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('aircraft_maintenance_finish_date')
    })
  }
}
