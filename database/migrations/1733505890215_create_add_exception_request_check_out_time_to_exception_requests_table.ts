import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exception_requests'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .time('exception_request_check_out_time')
        .after('exception_request_check_in_time')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('exception_request_check_out_time')
    })
  }
}
