import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservation_legs'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('reservation_leg_travel_time').notNullable().defaultTo(0).alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('reservation_leg_travel_time', 50).nullable().alter()
    })
  }
}
