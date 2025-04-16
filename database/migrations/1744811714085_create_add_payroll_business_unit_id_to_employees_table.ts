import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('payroll_business_unit_id')
        .unsigned()
        .references('business_unit_id')
        .inTable('business_units')
        .notNullable()
        .defaultTo(1)
        .after('business_unit_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('payroll_business_unit_id')
      table.dropColumn('payroll_business_unit_id')
    })
  }
}
