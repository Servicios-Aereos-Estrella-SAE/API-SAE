import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'airports'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('airport_active').defaultTo(1).alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('airport_active').alter()
    })
  }
}
