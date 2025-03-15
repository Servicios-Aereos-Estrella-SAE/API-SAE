import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_file_type_properties'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('proceeding_file_type_property_id')
      table.string('proceeding_file_type_property_name', 100).notNullable
      table.enum('proceeding_file_type_property_type', [
        'Text',
        'File',
        'Currency',
        'Decimal',
        'Number',
      ]).notNullable
      table.string('proceeding_file_type_property_category_name', 100).notNullable
      table.integer('proceeding_file_type_id').unsigned().notNullable()
      table
        .foreign('proceeding_file_type_id')
        .references('proceeding_file_types.proceeding_file_type_id')

      table.timestamp('proceeding_file_type_property_created_at').notNullable
      table.timestamp('proceeding_file_type_property_updated_at').notNullable
      table.timestamp('proceeding_file_type_property_deleted_at').nullable
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
