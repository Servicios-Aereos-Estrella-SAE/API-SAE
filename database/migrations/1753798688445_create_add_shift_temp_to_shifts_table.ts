import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shifts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.tinyint('shift_temp').after('shift_business_units').nullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('shift_temp')
    })
  }
}
