import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('role_management_days').nullable().after('role_business_access')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role_management_days')
    })
  }
}
