import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shift_exceptions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('shift_exception_period_in_days')
        .after('shift_exception_enjoyment_of_salary')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('shift_exception_period_in_days')
    })
  }
}
