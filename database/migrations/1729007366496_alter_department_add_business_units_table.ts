import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'departments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('business_unit_id')
        .unsigned()
        .references('business_unit_id')
        .inTable('business_units')
        .defaultTo(1)
        .after('company_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('business_unit_id')
      table.dropColumn('business_unit_id')
    })
  }
}
