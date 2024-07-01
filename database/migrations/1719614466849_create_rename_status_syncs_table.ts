import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rename_status_syncs'

  async up() {
    this.schema.renameTable('status_syncs', 'assist_status_syncs')
  }

  async down() {
    this.schema.renameTable('assist_status_syncs', 'status_syncs')
  }
}
