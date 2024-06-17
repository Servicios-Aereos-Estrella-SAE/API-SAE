import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'department_position'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('department_position_id')
      table.integer('department_id').unsigned().notNullable()
      table.integer('position_id').unsigned().notNullable()
      table.timestamp('department_position_last_synchronization_at').nullable()
      table.foreign('department_id').references('departments.department_id')
      table.foreign('position_id').references('positions.position_id')

      table.timestamp('department_position_created_at').notNullable()
      table.timestamp('department_position_updated_at').nullable()
      table.timestamp('department_position_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
