import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'holidays'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('holiday_id')
      table.string('holiday_name', 100)
      table.date('holiday_date')
      table.text('holiday_icon')
      table.timestamp('holiday_created_at')
      table.timestamp('holiday_updated_at')
      table.timestamp('holiday_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
