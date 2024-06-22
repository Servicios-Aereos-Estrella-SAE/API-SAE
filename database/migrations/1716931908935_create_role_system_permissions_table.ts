import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_system_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('role_system_permission_id')
      table.integer('role_id').unsigned().notNullable()
      table.integer('system_permission_id').unsigned().notNullable()
      table.foreign('role_id').references('roles.role_id')
      table.foreign('system_permission_id').references('system_permissions.system_permission_id')

      table.timestamp('role_system_permission_created_at').notNullable()
      table.timestamp('role_system_permission_updated_at').nullable()
      table.timestamp('role_system_permission_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
