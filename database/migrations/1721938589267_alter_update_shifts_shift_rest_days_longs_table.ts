import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shifts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('shift_rest_days', 25).alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('shift_rest_days', 5).alter()
    })
  }
}
