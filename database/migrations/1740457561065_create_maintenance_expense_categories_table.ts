import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'maintenance_expense_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('maintenance_expense_category_id').notNullable() // Primary Key
      table.string('maintenance_expense_category_name').notNullable()
      table.string('maintenance_expense_category_description').nullable()
      table.timestamp('maintenance_expense_category_created_at').notNullable()
      table.timestamp('maintenance_expense_category_updated_at').nullable()
      table.timestamp('maintenance_expense_category_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
