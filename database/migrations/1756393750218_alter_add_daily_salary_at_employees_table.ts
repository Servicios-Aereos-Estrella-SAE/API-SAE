import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    if (!await this.schema.hasColumn(this.tableName, 'daily_salary')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.decimal('daily_salary', 10, 4)
          .after('position_id')
          .defaultTo(0)
      })
    }
  }

  async down() {
    if (await this.schema.hasColumn(this.tableName, 'daily_salary')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('daily_salary')
      })
    }
  }
}
