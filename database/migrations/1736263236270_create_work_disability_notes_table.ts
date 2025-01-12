import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'work_disability_notes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('work_disability_note_id')
      table.text('work_disability_note_description', 'longtext').notNullable()
      table.integer('work_disability_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()

      table.foreign('work_disability_id').references('work_disabilities.work_disability_id')
      table.foreign('user_id').references('users.user_id')

      table.timestamp('work_disability_note_created_at').notNullable()
      table.timestamp('work_disability_note_updated_at').notNullable()
      table.timestamp('work_disability_note_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
