import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('customer_id').notNullable()
      table.string('customer_uuid', 255).nullable()
      table.integer('person_id').unsigned().notNullable()
      table.foreign('person_id').references('people.person_id')

      table.timestamp('customer_created_at').notNullable()
      table.timestamp('customer_updated_at').nullable()
      table.timestamp('customer_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
