import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exception_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('exception_type_id')
      table.string('exception_type_type_name', 100).notNullable
      table.text('exception_type_icon', 'longtext')
      table.string('exception_type_slug', 250).nullable()
      table.timestamp('exception_type_created_at').notNullable
      table.timestamp('exception_type_updated_at').notNullable
      table.timestamp('exception_type_deleted_at').nullable
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
