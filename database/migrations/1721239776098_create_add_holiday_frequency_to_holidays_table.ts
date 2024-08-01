import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'holidays'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('holiday_frequency').defaultTo(1)
      table.integer('holiday_icon_id').nullable()
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('holiday_frequency')
      table.dropColumn('holiday_icon_id')
    })
  }
}
