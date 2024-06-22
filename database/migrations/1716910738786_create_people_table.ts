import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'people'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('person_id')
      table.string('person_firstname', 150).notNullable()
      table.string('person_lastname', 150).notNullable()
      table.string('person_second_lastname', 150).notNullable()
      table.string('person_phone', 45).nullable()
      table.string('person_gender', 10).nullable()
      table.date('person_birthday').nullable()
      table.string('person_curp', 45).nullable()
      table.string('person_rfc', 45).nullable()
      table.string('person_imss_nss', 45).nullable()

      table.timestamp('person_created_at').notNullable()
      table.timestamp('person_updated_at')
      table.timestamp('person_deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
