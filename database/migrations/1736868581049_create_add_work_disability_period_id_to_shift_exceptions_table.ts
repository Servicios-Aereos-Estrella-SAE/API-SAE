import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shift_exceptions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('work_disability_period_id').after('shift_exception_time_by_time').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('work_disability_period_id')
    })
  }
}
