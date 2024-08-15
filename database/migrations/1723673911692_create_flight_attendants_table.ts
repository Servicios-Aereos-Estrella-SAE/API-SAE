import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'flight_attendants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('flight_attendant_id').notNullable()
      table.timestamp('flight_attendant_hire_date').nullable()
      table.string('flight_attendant_photo', 255).nullable()
      table.integer('person_id').unsigned().notNullable()
      table.foreign('person_id').references('people.person_id')

      table.timestamp('flight_attendant_created_at').notNullable()
      table.timestamp('flight_attendant_updated_at').nullable()
      table.timestamp('flight_attendant_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
