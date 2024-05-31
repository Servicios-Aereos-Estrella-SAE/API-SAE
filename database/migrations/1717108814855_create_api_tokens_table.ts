import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'api_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 250).nullable()
      table.string('type', 250).nullable()
      table.string('token', 250).nullable()
      table.string('browser', 250).nullable()
      table.string('ip_address', 250).nullable()
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.user_id')

      table.timestamp('created_at').notNullable()
      table.timestamp('expirated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
