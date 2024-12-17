import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'flight_attendants'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('person_id')
      table.dropColumn('person_id')
      table.integer('employee_id').unsigned().after('flight_attendant_photo').nullable()
      table.foreign('employee_id').references('employees.employee_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
