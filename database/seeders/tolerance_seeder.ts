import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tolerance from '../../app/models/tolerance.js'

export default class extends BaseSeeder {
  async run() {
    await Tolerance.firstOrCreate({ toleranceName: 'Delay' }, { toleranceMinutes: 1 })

    await Tolerance.firstOrCreate({ toleranceName: 'Fault' }, { toleranceMinutes: 3 })

    await Tolerance.firstOrCreate({ toleranceName: 'TardinessTolerance' }, { toleranceMinutes: 3 })
  }
}
