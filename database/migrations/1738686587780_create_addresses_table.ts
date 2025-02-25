import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('address_id')
      table.string('address_zipcode', 10).notNullable()
      table.string('address_country', 50).notNullable()
      table.string('address_state', 50).notNullable()
      table.string('address_township', 50).notNullable()
      table.string('address_city', 50).notNullable()
      table.string('address_settlement', 50).notNullable()
      table.string('address_settlement_type', 50).nullable()
      table.string('address_street', 65).notNullable()
      table.string('address_internal_number', 10).nullable()
      table.string('address_external_number', 10).nullable()
      table.string('address_between_street_1', 50).nullable()
      table.string('address_between_street_2', 50).nullable()
      table
        .integer('address_type_id')
        .unsigned()
        .references('address_type_id')
        .inTable('address_types')

      table.timestamp('address_created_at').notNullable()
      table.timestamp('address_updated_at')
      table.timestamp('address_deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
