import Tolerance from '../models/tolerance.js'

export default class ToleranceService {
  async index(): Promise<Tolerance[]> {
    const tolerances = await Tolerance.all()
    return tolerances
  }
}
