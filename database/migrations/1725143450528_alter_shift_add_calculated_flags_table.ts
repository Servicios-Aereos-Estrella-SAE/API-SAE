import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shifts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('shift_calculate_flag', 100).after('shift_name').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('shift_calculate_flag')
    })
  }
}