import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'insurance_coverage_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('insurance_coverage_type_id')
      table.string('insurance_coverage_type_name', 100).notNullable()
      table.string('insurance_coverage_type_description', 200).notNullable()
      table.string('insurance_coverage_type_slug', 250).notNullable()
      table.tinyint('insurance_coverage_type_active').notNullable()
      table.timestamp('insurance_coverage_type_created_at').notNullable()
      table.timestamp('insurance_coverage_type_updated_at').notNullable()
      table.timestamp('insurance_coverage_type_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
