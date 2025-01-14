import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary key
      table.increments('reservation_id').notNullable()

      // Foreign keys
      table.integer('customer_id').unsigned().notNullable()
      table.foreign('customer_id').references('customers.customer_id')

      table.integer('aircraft_id').unsigned().notNullable()
      table.foreign('aircraft_id').references('aircrafts.aircraft_id')

      table.integer('pilot_sic_id').unsigned().notNullable()
      table.foreign('pilot_sic_id').references('pilots.pilot_id')

      table.integer('pilot_pic_id').unsigned().notNullable()
      table.foreign('pilot_pic_id').references('pilots.pilot_id')

      table.integer('flight_attendant_id').unsigned().notNullable()
      table.foreign('flight_attendant_id').references('flight_attendants.flight_attendant_id')

      // Valores económicos
      // Ajusta la precisión (p. ej., (10,2), (12,2), etc.) a tus necesidades
      table.decimal('reservation_subtotal', 10, 2).notNullable()
      table.decimal('reservation_tax_factor', 10, 2).nullable()
      table.decimal('reservation_tax', 10, 2).notNullable()
      table.decimal('reservation_total', 10, 2).notNullable()

      // Timestamps (al estilo de tu ejemplo)
      table.timestamp('reservation_created_at').notNullable()
      table.timestamp('reservation_updated_at').nullable()
      table.timestamp('reservation_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
