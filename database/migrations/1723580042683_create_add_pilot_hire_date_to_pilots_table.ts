import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pilots'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.timestamp('pilot_hire_date').nullable()
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('pilot_hire_date')
    })
  }
}
