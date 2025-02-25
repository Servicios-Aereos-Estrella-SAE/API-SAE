import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircraft_maintenances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary key
      table.increments('aircraft_maintenance_id').notNullable()

      // Foreign key al tipo de mantenimiento
      table.integer('maintenance_type_id').unsigned().notNullable()
      table.foreign('maintenance_type_id').references('maintenance_types.maintenance_type_id')

      // Foreign key al aircraft (ajusta el nombre de la tabla/columna si es distinto)
      table.integer('aircraft_id').unsigned().notNullable()
      table.foreign('aircraft_id').references('aircrafts.aircraft_id')

      // Fechas
      table.timestamp('aircraft_maintenance_start_date').notNullable()
      table.timestamp('aircraft_maintenance_end_date').notNullable()
      table.string('aircraft_maintenance_notes').nullable()

      // Otros campos
      table.integer('maintenance_urgency_level_id').unsigned().notNullable()
      table
        .foreign('maintenance_urgency_level_id')
        .references('maintenance_urgency_levels.maintenance_urgency_level_id')
      // Foreign key al status
      table.integer('aircraft_maintenance_status_id').unsigned().notNullable()
      table
        .foreign('aircraft_maintenance_status_id')
        .references('aircraft_maintenance_statuses.aircraft_maintenance_status_id')

      // Timestamps (con tu convención de nombres)
      table.timestamp('aircraft_maintenance_created_at').notNullable()
      table.timestamp('aircraft_maintenance_updated_at').nullable()
      table.timestamp('aircraft_maintenance_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
