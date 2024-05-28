import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('role_id')
      table.string('role_name', 100).notNullable()
      table.string('role_description', 200).nullable()
      table.string('role_slug', 150).notNullable()
      table.tinyint('role_active').notNullable()

      table.timestamp('role_created_at').notNullable()
      table.timestamp('role_updated_at').nullable()
      table.timestamp('role_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
