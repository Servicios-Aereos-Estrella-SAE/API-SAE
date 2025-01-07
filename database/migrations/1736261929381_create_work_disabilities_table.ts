import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'work_disabilities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('work_disability_id')
      table.string('work_disability_uuid', 250).notNullable()
      table.integer('employee_id').unsigned().notNullable()
      table.integer('insurance_coverage_type_id').unsigned().notNullable()

      table.foreign('employee_id').references('employees.employee_id')
      table
        .foreign('insurance_coverage_type_id')
        .references('insurance_coverage_types.insurance_coverage_type_id')

      table.timestamp('work_disability_created_at').notNullable()
      table.timestamp('work_disability_updated_at').notNullable()
      table.timestamp('work_disability_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
