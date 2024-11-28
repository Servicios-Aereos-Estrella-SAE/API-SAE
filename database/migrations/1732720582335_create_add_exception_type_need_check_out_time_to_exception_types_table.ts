import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exception_types'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .tinyint('exception_type_need_check_out_time')
        .after('exception_type_need_check_in_time')
        .nullable()
        .defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('exception_type_need_check_out_time')
    })
  }
}
