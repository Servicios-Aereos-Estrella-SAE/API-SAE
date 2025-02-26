import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'work_disability_period_expenses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('work_disability_period_expense_id')
      table.string('work_disability_period_expense_file', 255).nullable()
      table.double('work_disability_period_expense_amount', 10, 2).nullable().defaultTo(0)
      table.integer('work_disability_period_id').unsigned().notNullable()

      table
        .foreign(
          'work_disability_period_id',
          'fk_work_disability_period_expenses_work_disability_period_id'
        )
        .references('work_disability_period_id')
        .inTable('work_disability_periods')

      table.timestamp('work_disability_period_expense_created_at').notNullable()
      table.timestamp('work_disability_period_expense_updated_at').notNullable()
      table.timestamp('work_disability_period_expense_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
