import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vacation_settings'

  async up() {
    // this.schema.table(this.tableName, (table) => {
    //   table.dropUnique(['years_of_service'], 'years_of_service_UNIQUE')
    // })
  }

  async down() {
    // this.schema.table(this.tableName, (table) => {
    //   table.unique(['years_of_service'], 'vacation_settings_years_of_service_unique')
    // })
  }
}
