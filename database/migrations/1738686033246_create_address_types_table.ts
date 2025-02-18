import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'address_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('address_type_id')
      table.string('address_type_name', 100).notNullable()
      table.string('address_type_description', 200).nullable()
      table.string('address_type_slug', 150).notNullable()
      table.tinyint('address_type_active').notNullable()

      table.timestamp('address_type_created_at').notNullable()
      table.timestamp('address_type_updated_at').nullable()
      table.timestamp('address_type_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
