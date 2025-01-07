import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'work_disability_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('work_disability_type_id')
      table.string('work_disability_type_name', 100).notNullable()
      table.string('work_disability_type_description', 200).notNullable()
      table.string('work_disability_type_slug', 250).notNullable()
      table.tinyint('work_disability_type_active').notNullable()
      table.timestamp('work_disability_type_created_at').notNullable()
      table.timestamp('work_disability_type_updated_at').notNullable()
      table.timestamp('work_disability_type_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
