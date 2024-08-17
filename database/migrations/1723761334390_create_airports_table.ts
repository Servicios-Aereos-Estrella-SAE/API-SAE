import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'airports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('airport_id')
      table
        .enum('airport_type', [
          'heliport',
          'small_airport',
          'seaplane_base',
          'balloonport',
          'medium_airport',
          'large_airport',
        ])
        .notNullable()
      table.string('airport_name').unique()
      table.decimal('airport_latitude_deg', 12)
      table.decimal('airport_longitude_deg', 12)
      table.integer('airport_elevation_ft')
      table.string('airport_display_location_name')
      table.string('airport_iso_country', 20)
      table.string('airport_iso_region', 255)
      table.string('airport_active')
      table.string('airport_icao_code', 12).notNullable().unique()
      table.string('airport_iata_code', 12)

      table.timestamp('airport_created_at', { useTz: true })
      table.timestamp('airport_updated_at', { useTz: true })
      table.timestamp('airport_deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
