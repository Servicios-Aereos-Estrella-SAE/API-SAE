import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircraft_operators'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('aircraft_operator_id').notNullable()
      table.string('aircraft_operator_name', 255).notNullable()
      table.string('aircraft_operator_fiscal_name', 255).nullable()
      table.string('aircraft_operator_image', 255).nullable()
      table.string('aircraft_operator_slug', 255).notNullable()
      table.boolean('aircraft_operator_active').defaultTo(true)
      table.timestamp('aircraft_operator_created_at').notNullable()
      table.timestamp('aircraft_operator_updated_at').nullable()
      table.timestamp('aircraft_operator_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
