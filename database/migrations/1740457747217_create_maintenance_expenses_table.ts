import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'maintenance_expenses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('maintenance_expense_id').notNullable() // Primary Key

      // Foreign key al mantenimiento
      table.integer('aircraft_maintenance_id').unsigned().notNullable()
      table
        .foreign('aircraft_maintenance_id')
        .references('aircraft_maintenances.aircraft_maintenance_id')

      // Foreign key a la categoría de gastos
      table.integer('maintenance_expense_category_id').unsigned().notNullable()
      table
        .foreign('maintenance_expense_category_id')
        .references('maintenance_expense_categories.maintenance_expense_category_id')

      // Detalles del gasto
      table.decimal('maintenance_expense_amount', 10, 2).notNullable()
      table.string('maintenance_expense_ticket').nullable() // Ruta al archivo (PDF o imagen)
      table.string('maintenance_expense_tracking_number').notNullable() // Folio de rastreo
      table.uuid('maintenance_expense_internal_folio').notNullable() // Folio interno único

      // Timestamps
      table.timestamp('maintenance_expense_created_at').notNullable()
      table.timestamp('maintenance_expense_updated_at').nullable()
      table.timestamp('maintenance_expense_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
