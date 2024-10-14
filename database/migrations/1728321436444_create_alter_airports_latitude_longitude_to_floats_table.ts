import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'airports'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('airport_latitude_deg').alter()
      table.string('airport_longitude_deg').alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('airport_latitude_deg', 24, 12).alter()
      table.decimal('airport_longitude_deg', 24, 12).alter()
    })
  }
}
