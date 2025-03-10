import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shift_exceptions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .tinyint('shift_exception_enjoyment_of_salary')
        .after('shift_exception_check_out_time')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('shift_exception_enjoyment_of_salary')
    })
  }
}
