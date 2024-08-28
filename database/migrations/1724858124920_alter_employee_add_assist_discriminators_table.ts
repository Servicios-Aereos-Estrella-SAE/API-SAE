import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .tinyint('employee_assist_discriminator')
        .defaultTo(0)
        .after('business_unit_id')
        .notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employee_assist_discriminator')
    })
  }
}
