import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'business_units'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('business_unit_id').notNullable()
      table.string('business_unit_name', 200).notNullable()
      table.string('business_unit_slug', 250).notNullable()
      table.string('business_unit_legal_name', 250).notNullable()
      table.tinyint('business_unit_active').notNullable().defaultTo(1)

      table.timestamp('business_unit_created_at').nullable()
      table.timestamp('business_unit_updated_at').nullable()
      table.timestamp('business_unit_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
