import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exception_requests'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('requested_date', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('requested_date')
    })
  }
}
