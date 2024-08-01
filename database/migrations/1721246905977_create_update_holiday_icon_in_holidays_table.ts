import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'holidays'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.text('holiday_icon', 'longtext').alter()
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.text('holiday_icon', 'longtext').alter()
    })
  }
}
