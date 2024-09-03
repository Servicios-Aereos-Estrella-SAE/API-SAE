import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'galleries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('galery_id')
      table.string('galery_path').notNullable()
      table.string('galery_category').nullable()
      table.integer('galery_id_table').unsigned().notNullable()
      table.string('galery_name_table').nullable()
      table.timestamp('galery_created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('galery_updated_at', { useTz: true }).nullable()
      table.timestamp('galery_deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
