import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_permissions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('system_module_id').references('system_modules.system_module_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('system_module_id')
    })
  }
}
