import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AircraftClass from '../../app/models/aircraft_class.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await AircraftClass.createMany([
      {
        aircraftClassBanner: 'Banner ',
        aircraftClassLongDescription: 'Long description for class 1',
        aircraftClassShortDescription:
          'Compact Light Jets (also known as Very Light Jets or VLJs) offer a tailored solution for short to mid-range trips when larger equipment is not necessary. Typically seating 4-5 passengers and offering a range of 3-3.5hrs, Compact Jets are a great choice for many regional trips.',
        aircraftClassName: 'Compact Light Jet',
        aircraftClassSlug: 'class-1',
        aircraftClassStatus: 1,
      },
      {
        aircraftClassBanner: 'Banner ',
        aircraftClassLongDescription: 'Long description for class 2',
        aircraftClassShortDescription:
          'Light Jets are often the choice for flights in the 3-4hr range, typically capable of flying 1500 miles nonstop. Light Jets seat 6-7 passengers comfortably and up to 8 at| maximum capacity.',
        aircraftClassName: 'Light Jet',
        aircraftClassSlug: 'class-2',
        aircraftClassStatus: 1,
      },
      {
        aircraftClassBanner: 'Banner',
        aircraftClassLongDescription: 'Long description for class',
        aircraftClassShortDescription:
          'Midsize Jets offer greater range a larger interior for passengers than Light Jets. Interior features are similar to Light Jets but have more layout options, such as spacious divans to stretch out on, and expanded galley and bathroom options.',
        aircraftClassName: 'Midsize Jet',
        aircraftClassSlug: 'class',
        aircraftClassStatus: 1,
      },
      {
        aircraftClassBanner: 'Banner',
        aircraftClassLongDescription: 'Long description for class',
        aircraftClassShortDescription:
          'Super Midsize Jets offer greater range and increased cabin space than Midsize Jets, seating 8-10 people on nonstop cross-country routes. Smaller and more efficient than Heavy Jets, Supermids filled a growing need in the marketplace for aircraft with increased range at a lower price point than Heavy and Long Range aircraft.',
        aircraftClassName: 'Super Midsize Jet',
        aircraftClassSlug: 'class',
        aircraftClassStatus: 1,
      },
      {
        aircraftClassBanner: 'Banner',
        aircraftClassLongDescription: 'Long description for class',
        aircraftClassShortDescription:
          'Heavy jets are the largest and most luxurious of the private jets readily available in the charter market. With major names like Bombardier, Gulfstream and Dassault| manufacturing advanced equipment for lofty price tags, Heavy Jets are the best of the best',
        aircraftClassName: 'Heavy Jet',
        aircraftClassSlug: 'class',
        aircraftClassStatus: 1,
      },
      {
        aircraftClassBanner: 'Banner',
        aircraftClassLongDescription: 'Long description for class',
        aircraftClassShortDescription:
          'The Ultra Long Range category of business jets represents the newest and most technologically advanced aircraft available. The term Ultra Long Range became widely used in 2004 when Gulfstream announced the G-V.',
        aircraftClassName: 'Ultra Long Range Jet',
        aircraftClassSlug: 'class',
        aircraftClassStatus: 1,
      },
    ])
  }
}
