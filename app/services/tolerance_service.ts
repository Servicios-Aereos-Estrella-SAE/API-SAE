import Tolerance from '../models/tolerance.js'

export default class ToleranceService {
  async index(): Promise<Tolerance[]> {
    const tolerances = await Tolerance.all()
    return tolerances
  }

  async getTardinessTolerance() {
    const tolerance = await Tolerance.query()
      .whereNull('tolerance_deleted_at')
      .where('tolerance_name', 'TardinessTolerance')
      .first()
    return tolerance ? tolerance : null
  }
}
