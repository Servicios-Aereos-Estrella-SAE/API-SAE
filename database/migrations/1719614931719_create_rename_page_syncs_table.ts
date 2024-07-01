import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rename_page_syncs'

  async up() {
    this.schema.renameTable('page_syncs', 'assist_page_syncs')
  }

  async down() {
    this.schema.renameTable('assist_page_syncs', 'page_syncs')
  }
}
