import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_shift_changes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_shift_change_id')

      table.integer('employee_id_from').unsigned().notNullable()
      table.foreign('employee_id_from').references('employees.employee_id')

      table.integer('shift_id_from').unsigned().notNullable()
      table.foreign('shift_id_from').references('shifts.shift_id')

      table.timestamp('employee_shift_change_date_from').notNullable()
      table.tinyint('employee_shift_change_date_from_is_rest_day').notNullable().defaultTo(0)

      table.integer('employee_id_to').unsigned().notNullable()
      table.foreign('employee_id_to').references('employees.employee_id')

      table.integer('shift_id_to').unsigned().notNullable()
      table.foreign('shift_id_to').references('shifts.shift_id')

      table.timestamp('employee_shift_change_date_to').notNullable()
      table.tinyint('employee_shift_change_date_to_is_rest_day').notNullable().defaultTo(0)

      table.timestamp('employee_shift_change_created_at').notNullable()
      table.timestamp('employee_shift_change_updated_at')
      table.timestamp('employee_shift_change_deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
