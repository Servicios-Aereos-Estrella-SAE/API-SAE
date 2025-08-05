import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_contracts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.tinyint('employee_contract_active').after('payroll_business_unit_id').nullable().defaultTo(1)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employee_contract_active')
    })
  }
}
