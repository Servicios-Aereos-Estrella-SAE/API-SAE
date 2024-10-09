import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircraft_properties'
  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('aircraft_properties_banner').nullable()
    })
  }
  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('aircraft_properties_banner')
    })
  }
}
