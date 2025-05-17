import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shift_exception_evidences'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('shift_exception_evidence_id')
      table.string('shift_exception_evidence_file', 250).notNullable()
      table.string('shift_exception_evidence_type', 50).nullable()

      table.integer('shift_exception_id').unsigned().notNullable()
      table
        .foreign('shift_exception_id')
        .references('shift_exceptions.shift_exception_id')

      table.timestamp('shift_exception_evidence_created_at').notNullable()
      table.timestamp('shift_exception_evidence_updated_at').notNullable()
      table.timestamp('shift_exception_evidence_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
