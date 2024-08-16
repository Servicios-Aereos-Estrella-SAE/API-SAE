import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vacation_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('updated_at').notNullable().alter()
    })
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('updated_at', 'vacation_setting_updated_at')
    })
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('vacation_setting_updated_at').notNullable().defaultTo(this.now()).alter()
    })
  }
  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('vacation_setting_updated_at').notNullable().alter()
    })
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('vacation_setting_updated_at', 'updated_at')
    })
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('updated_at').notNullable().defaultTo(this.now()).alter()
    })
  }
}
