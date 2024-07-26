import { BaseSchema } from '@adonisjs/lucid/schema'

export default class VacationSettings extends BaseSchema {
  protected tableName = 'vacation_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('years_of_service').notNullable().unique()
      table.integer('vacation_days').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
