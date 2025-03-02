import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircraft_maintenance_statuses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary Key
      table.increments('aircraft_maintenance_status_id').notNullable()

      // Nombre del estatus
      table.string('aircraft_maintenance_status_name', 100).notNullable()
      table.string('aircraft_maintenance_status_color', 100).notNullable()
      table.string('aircraft_maintenance_status_bg', 100).notNullable()

      // Timestamps
      table.timestamp('aircraft_maintenance_status_created_at').notNullable()
      table.timestamp('aircraft_maintenance_status_updated_at').nullable()
      table.timestamp('aircraft_maintenance_status_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
