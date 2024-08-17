import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pilots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('pilot_id').notNullable()
      table.string('pilot_photo', 255).nullable()
      table.integer('person_id').unsigned().notNullable()
      table.foreign('person_id').references('people.person_id')

      table.timestamp('pilot_created_at').notNullable()
      table.timestamp('pilot_updated_at').nullable()
      table.timestamp('pilot_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
