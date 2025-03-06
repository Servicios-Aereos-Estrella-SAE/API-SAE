import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_emergency_contacts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('employee_emergency_contact_id')
      table.string('employee_emergency_contact_firstname', 150).notNullable()
      table.string('employee_emergency_contact_lastname', 150).notNullable()
      table.string('employee_emergency_contact_second_lastname', 150).notNullable()
      table.string('employee_emergency_contact_relationship', 150).notNullable()
      table.string('employee_emergency_contact_phone', 45).notNullable()
      table.integer('employee_id').unsigned().notNullable()
      table.foreign('employee_id').references('employees.employee_id')

      table.timestamp('employee_emergency_contact_created_at').notNullable()
      table.timestamp('employee_emergency_contact_updated_at')
      table.timestamp('employee_emergency_contact_deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
