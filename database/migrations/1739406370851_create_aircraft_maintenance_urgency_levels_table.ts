import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'maintenance_urgency_levels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary Key
      table.increments('maintenance_urgency_level_id').notNullable()

      // Nombre del nivel de urgencia
      table.string('maintenance_urgency_level_name', 100).notNullable()
      table.string('maintenance_urgency_level_description', 255).nullable()
      table.string('maintenance_urgency_level_color', 100).notNullable()
      table.string('maintenance_urgency_level_bg', 100).notNullable()

      // Timestamps
      table.timestamp('maintenance_urgency_level_created_at').notNullable()
      table.timestamp('maintenance_urgency_level_updated_at').nullable()
      table.timestamp('maintenance_urgency_level_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
