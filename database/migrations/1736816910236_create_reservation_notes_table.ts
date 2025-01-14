import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservation_notes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('reservation_note_id').notNullable()

      table.integer('reservation_id').unsigned().notNullable()
      table.foreign('reservation_id').references('reservations.reservation_id')

      table.text('reservation_note_content').notNullable()

      table.timestamp('reservation_note_created_at').notNullable()
      table.timestamp('reservation_note_updated_at').nullable()
      table.timestamp('reservation_note_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
