import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('user_id').notNullable()
      table.string('user_email', 254).notNullable().unique()
      table.string('user_password').notNullable()
      table.integer('person_id').unsigned().notNullable()
      table.integer('role_id').unsigned().notNullable()
      table.foreign('person_id').references('people.person_id')
      table.foreign('role_id').references('roles.role_id')

      table.timestamp('user_created_at').notNullable()
      table.timestamp('user_updated_at').nullable()
      table.timestamp('user_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
