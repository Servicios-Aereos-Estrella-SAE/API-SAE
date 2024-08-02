import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vacation_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('created_at').notNullable().alter()
    })
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('created_at', 'vacation_setting_created_at')
    })
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('vacation_setting_created_at').notNullable().defaultTo(this.now()).alter()
    })
  }
  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('vacation_setting_created_at').notNullable().alter()
    })
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('vacation_setting_created_at', 'created_at')
    })
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('created_at').notNullable().defaultTo(this.now()).alter()
    })
  }
}
