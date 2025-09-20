import SystemSetting from '#models/system_setting'
import SystemSettingPayrollConfig from '#models/system_setting_payroll_config'

export default class SystemSettingPayrollConfigService {

  async create(systemSettingPayrollConfig: SystemSettingPayrollConfig) {
    const newSystemSettingPayrollConfig = new SystemSettingPayrollConfig()
    newSystemSettingPayrollConfig.systemSettingPayrollConfigPaymentType = systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType
    newSystemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid = systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid
    newSystemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset = systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset
    newSystemSettingPayrollConfig.systemSettingPayrollConfigApplySince = systemSettingPayrollConfig.systemSettingPayrollConfigApplySince
    newSystemSettingPayrollConfig.systemSettingId = systemSettingPayrollConfig.systemSettingId
    await newSystemSettingPayrollConfig.save()
    return newSystemSettingPayrollConfig
  }

  async update(currentSystemSetting: SystemSettingPayrollConfig, systemSettingPayrollConfig: SystemSettingPayrollConfig) {
    currentSystemSetting.systemSettingPayrollConfigPaymentType = systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType
    currentSystemSetting.systemSettingPayrollConfigNumberOfDaysToBePaid = systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid
    currentSystemSetting.systemSettingPayrollConfigNumberOfOverdueDaysToOffset = systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset
    currentSystemSetting.systemSettingPayrollConfigApplySince = systemSettingPayrollConfig.systemSettingPayrollConfigApplySince
    await currentSystemSetting.save()
    return currentSystemSetting
  }

  async delete(currentSystemSetting: SystemSettingPayrollConfig) {
    await currentSystemSetting.delete()
    return currentSystemSetting
  }

  async show(systemSettingPayrollConfigId: number) {
    const systemSettingPayrollConfig = await SystemSettingPayrollConfig.query()
      .whereNull('system_setting_payroll_config_deleted_at')
      .where('system_setting_payroll_config_id', systemSettingPayrollConfigId)
      .first()
    return systemSettingPayrollConfig ? systemSettingPayrollConfig : null
  }

  async verifyInfoExist(systemSettingPayrollConfig: SystemSettingPayrollConfig) {
    if (!systemSettingPayrollConfig.systemSettingPayrollConfigId) {
      const existSystemSetting = await SystemSetting.query()
        .whereNull('system_setting_deleted_at')
        .where('system_setting_id', systemSettingPayrollConfig.systemSettingId)
        .first()

      if (!existSystemSetting && systemSettingPayrollConfig.systemSettingId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The system setting was not found',
          message: 'The system setting was not found with the entered ID',
          data: { ...systemSettingPayrollConfig },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...systemSettingPayrollConfig },
    }
  }

}
