import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_shifts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_shift_id')
      table
        .integer('employee_id')
        .unsigned()
        .references('employee_id')
        .inTable('employees')
        .onDelete('CASCADE')
      table
        .integer('shift_id')
        .unsigned()
        .references('shift_id')
        .inTable('shifts')
        .onDelete('CASCADE')
      table.timestamp('employe_shifts_created_at').notNullable()
      table.timestamp('employe_shifts_updated_at').nullable()
      table.timestamp('employe_shifts_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
