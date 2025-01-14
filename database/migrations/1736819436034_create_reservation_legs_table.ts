import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservation_legs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('reservation_leg_id').notNullable()
      // Campos que describen el lugar de salida y llegada
      // Se renombra 'from' a 'reservation_leg_from_location'
      // y 'to' a 'reservation_leg_to_location' para mayor claridad
      table.string('reservation_leg_from_location', 255).nullable()
      table.string('reservation_leg_to_location', 255).nullable()

      // FK hacia airports (asumiendo que existe la tabla 'airports' con 'airport_id')
      table.integer('airport_departure_id').unsigned().notNullable()
      table.foreign('airport_departure_id').references('airports.airport_id')

      table.integer('airport_destination_id').unsigned().notNullable()
      table.foreign('airport_destination_id').references('airports.airport_id')

      // Fechas y horas de salida y llegada
      table.date('reservation_leg_departure_date').nullable()
      table.time('reservation_leg_departure_time').nullable()
      table.date('reservation_leg_arrive_date').nullable()
      table.time('reservation_leg_arrive_time').nullable()

      // Otros campos
      table.integer('reservation_leg_pax').nullable() // Cantidad de pasajeros
      table.string('reservation_leg_travel_time', 50).nullable() // Duración del viaje (hh:mm, por ejemplo)
      table.decimal('reservation_leg_distance_mn', 10, 2).nullable() // Distancia en millas náuticas

      // FK con la tabla reservations
      table.integer('reservation_id').unsigned().notNullable()
      table.foreign('reservation_id').references('reservations.reservation_id')

      // Timestamps
      table.timestamp('reservation_leg_created_at').notNullable()
      table.timestamp('reservation_leg_updated_at').nullable()
      table.timestamp('reservation_leg_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
