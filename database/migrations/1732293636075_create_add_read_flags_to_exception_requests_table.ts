import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exception_requests'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.tinyint('exception_request_rh_read').notNullable().defaultTo(0)
      table.tinyint('exception_request_gerencial_read').notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('exception_request_rh_read')
      table.dropColumn('exception_request_gerencial_read')
    })
  }
}
