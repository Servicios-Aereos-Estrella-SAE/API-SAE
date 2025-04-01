import Tolerance from '../models/tolerance.js'

export default class ToleranceService {
  async index(systemSettingId: number): Promise<Tolerance[]> {
    const tolerances = await Tolerance.query()
      .where('system_setting_id', systemSettingId)
      .orderBy('system_setting_id')
    return tolerances
  }

  async getTardinessTolerance(systemSettingId: number) {
    const tolerance = await Tolerance.query()
      .whereNull('tolerance_deleted_at')
      .where('tolerance_name', 'TardinessTolerance')
      .where('system_setting_id', systemSettingId)
      .first()
    return tolerance ? tolerance : null
  }
}
