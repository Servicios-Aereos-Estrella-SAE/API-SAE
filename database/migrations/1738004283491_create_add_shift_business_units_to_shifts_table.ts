import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shifts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('shift_business_units', 255).after('shift_rest_days').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('shift_business_units')
    })
  }
}
