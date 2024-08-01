import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shifts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('shift_active_hours', 10, 2).alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('shift_active_hours').alter()
    })
  }
}
