import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pilots'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('person_id')
      table.dropColumn('person_id')
      table.integer('employee_id').unsigned().after('pilot_photo').nullable()
      table.foreign('employee_id').references('employees.employee_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
