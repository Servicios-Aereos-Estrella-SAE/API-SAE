import SystemModule from '#models/system_module'
import SystemSetting from '#models/system_setting'
import SystemSettingSystemModule from '#models/system_setting_system_module'

export default class SystemSettingSystemModuleService {
  async syncCreate(systemSettingId: number, systemModuleId: number) {
    const newSystemSettingSystemModule = new SystemSettingSystemModule()
    newSystemSettingSystemModule.systemSettingId = systemSettingId
    newSystemSettingSystemModule.systemModuleId = systemModuleId
    await newSystemSettingSystemModule.save()
    return newSystemSettingSystemModule
  }

  async create(systemSettingSystemModule: SystemSettingSystemModule) {
    const newSystemSettingSystemModule = new SystemSettingSystemModule()
    newSystemSettingSystemModule.systemSettingId = systemSettingSystemModule.systemSettingId
    newSystemSettingSystemModule.systemModuleId = systemSettingSystemModule.systemModuleId
    await newSystemSettingSystemModule.save()
    return newSystemSettingSystemModule
  }

  async update(
    currentSystemSettingSystemModule: SystemSettingSystemModule,
    systemSettingSystemModule: SystemSettingSystemModule
  ) {
    currentSystemSettingSystemModule.systemSettingId = systemSettingSystemModule.systemSettingId
    currentSystemSettingSystemModule.systemModuleId = systemSettingSystemModule.systemModuleId
    await currentSystemSettingSystemModule.save()
    return currentSystemSettingSystemModule
  }

  async delete(currentSystemSettingSystemModule: SystemSettingSystemModule) {
    await currentSystemSettingSystemModule.delete()
    return currentSystemSettingSystemModule
  }

  async show(systemSettingSystemModuleId: number) {
    const systemSettingSystemModule = await SystemSettingSystemModule.query()
      .whereNull('system_setting_system_module_deleted_at')
      .where('system_setting_system_module_id', systemSettingSystemModuleId)
      .first()
    return systemSettingSystemModule ? systemSettingSystemModule : null
  }

  async verifyInfoExist(systemSettingSystemModule: SystemSettingSystemModule) {
    const existSystemSetting = await SystemSetting.query()
      .whereNull('system_setting_deleted_at')
      .where('system_setting_id', systemSettingSystemModule.systemSettingId)
      .first()

    if (!existSystemSetting && systemSettingSystemModule.systemSettingId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The system setting was not found',
        message: 'The system setting was not found with the entered ID',
        data: { ...systemSettingSystemModule },
      }
    }

    const existSystemModule = await SystemModule.query()
      .whereNull('system_module_deleted_at')
      .where('system_module_id', systemSettingSystemModule.systemModuleId)
      .first()

    if (!existSystemModule && systemSettingSystemModule.systemModuleId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The system module was not found',
        message: 'The system module was not found with the entered ID',
        data: { ...systemSettingSystemModule },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...systemSettingSystemModule },
    }
  }

  async verifyInfo(systemSettingSystemModule: SystemSettingSystemModule) {
    const action = systemSettingSystemModule.systemSettingSystemModuleId > 0 ? 'updated' : 'created'
    const existSystemSettingSystemModule = await SystemSettingSystemModule.query()
      .whereNull('system_setting_system_module_deleted_at')
      .if(systemSettingSystemModule.systemSettingSystemModuleId > 0, (query) => {
        query.whereNot(
          'system_setting_system_module_id',
          systemSettingSystemModule.systemSettingSystemModuleId
        )
      })
      .where('system_setting_id', systemSettingSystemModule.systemSettingId)
      .where('system_module_id', systemSettingSystemModule.systemModuleId)
      .first()
    if (existSystemSettingSystemModule) {
      return {
        status: 400,
        type: 'warning',
        title: 'The relation systemSetting-systemModule already exists',
        message: `The relation systemSetting-systemModule resource cannot be ${action} because the relation is already assigned`,
        data: { ...systemSettingSystemModule },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...systemSettingSystemModule },
    }
  }
}
