import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tolerance from '../../app/models/tolerance.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Tolerance.createMany([
      {
        toleranceName: 'Delay',
        toleranceMinutes: 1,
      },
      {
        toleranceName: 'Fault',
        toleranceMinutes: 3,
      },
    ])
  }
}
