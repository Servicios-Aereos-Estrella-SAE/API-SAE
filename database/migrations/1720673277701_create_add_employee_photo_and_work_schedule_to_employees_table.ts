import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('employee_photo').nullable()
      table.enum('employee_work_schedule', ['Onsite', 'Remote']).defaultTo('Onsite')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('employee_photo')
      table.dropColumn('employee_work_schedule')
    })
  }
}
