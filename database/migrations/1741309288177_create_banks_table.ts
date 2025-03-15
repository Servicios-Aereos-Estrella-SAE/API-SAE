import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'banks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('bank_id').notNullable()
      table.string('bank_name', 200).notNullable()
      table.tinyint('bank_active').notNullable()
      table.timestamp('bank_created_at').notNullable()
      table.timestamp('bank_updated_at').nullable()
      table.timestamp('bank_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
