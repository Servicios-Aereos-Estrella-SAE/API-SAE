import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_spouses'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('employee_spouse_phone', 45).after('employee_spouse_birthday').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employee_spouse_phone')
    })
  }
}
