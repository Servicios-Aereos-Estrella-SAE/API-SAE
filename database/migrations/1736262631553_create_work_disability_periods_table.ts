import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'work_disability_periods'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('work_disability_period_id')
      table.timestamp('work_disability_period_start_date').notNullable()
      table.timestamp('work_disability_period_end_date').notNullable()
      table.string('work_disability_period_ticket_folio', 100).notNullable()
      table.string('work_disability_period_file', 255).nullable()
      table.integer('work_disability_id').unsigned().notNullable()
      table.integer('work_disability_type_id').unsigned().notNullable()

      table.foreign('work_disability_id').references('work_disabilities.work_disability_id')
      table
        .foreign('work_disability_type_id')
        .references('work_disability_types.work_disability_type_id')

      table.timestamp('work_disability_period_created_at').notNullable()
      table.timestamp('work_disability_period_updated_at').notNullable()
      table.timestamp('work_disability_period_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
