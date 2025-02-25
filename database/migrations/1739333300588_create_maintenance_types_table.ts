import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'maintenance_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('maintenance_type_id').notNullable()

      // Campos principales
      table.string('maintenance_type_name', 100).notNullable()
      table.text('maintenance_type_description').nullable()

      // Timestamps (con tu convención de nombres)
      table.timestamp('maintenance_type_created_at').notNullable()
      table.timestamp('maintenance_type_updated_at').nullable()
      table.timestamp('maintenance_type_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
