import Airport from '#models/airport'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Airport.create({
      airportType: 'large_airport',
      airportName: 'Aeropuerto Internacional Adolfo López Mateos',
      airportLatitudeDeg: 19.338196,
      airportLongitudeDeg: -99.570358,
      airportElevationFt: 8466,
      airportDisplayLocationName: 'Ciudad de Toluca, México',
      airportIsoCountry: 'MX',
      airportIsoRegion: 'MX-MEX',
      airportActive: 1,
      airportIcaoCode: 'MMTO',
      airportIataCode: 'TLC',
    })
  }
}
