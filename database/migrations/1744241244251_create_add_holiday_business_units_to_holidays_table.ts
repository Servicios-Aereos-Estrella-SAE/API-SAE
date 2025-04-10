import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'holidays'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('holiday_business_units')
        .notNullable()
        .defaultTo('sae,sae-siler,sae-quorum')
        .after('holiday_date')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('holiday_business_units')
    })
  }
}
