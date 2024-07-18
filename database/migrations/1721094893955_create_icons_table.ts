import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'icons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('icon_id')
      table.string('icon_name', 100)
      table.text('icon_svg')
      table.timestamp('icon_created_at')
      table.timestamp('icon_updated_at')
      table.timestamp('icon_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
