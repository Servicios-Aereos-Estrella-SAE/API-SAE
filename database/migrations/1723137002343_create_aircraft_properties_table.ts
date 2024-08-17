import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircraft_properties'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('aircraft_properties_id')
      table.string('aircraft_properties_name').notNullable()
      table
        .integer('aircraft_class_id')
        .unsigned()
        .notNullable()
        .references('aircraft_class_id')
        .inTable('aircraft_classes')
        .onDelete('CASCADE')
      table.integer('aircraft_properties_pax').notNullable().unsigned()
      table.integer('aircraft_properties_speed').notNullable().unsigned()
      table.integer('aircraft_properties_max_kg').notNullable().unsigned()
      table.integer('aircraft_properties_autonomy').notNullable().unsigned()
      table.integer('aircraft_properties_autonomy_hours').notNullable().unsigned()
      table.decimal('aircraft_properties_hourly_rate', 12, 2).defaultTo(0).unsigned()
      table.decimal('aircraft_properties_landing_cost_base', 12, 2).defaultTo(0).unsigned()
      table.decimal('aircraft_properties_landing_cost_national', 12, 2).notNullable().unsigned()
      table.decimal('aircraft_properties_landing_cost_international', 12, 2).defaultTo(0).unsigned()
      table.decimal('aircraft_properties_overnight_stay_local', 12, 2).defaultTo(0).unsigned()
      table
        .decimal('aircraft_properties_overnight_stay_international', 12, 2)
        .notNullable()
        .unsigned()
      table.decimal('aircraft_properties_fuel_surcharge', 12, 2).defaultTo(0).unsigned()
      table.text('aircraft_properties_description').nullable()
      table.timestamp('aircraft_properties_created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('aircraft_properties_updated_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('aircraft_properties_deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
