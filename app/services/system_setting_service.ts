import SystemSetting from '#models/system_setting'
import SystemSettingSystemModule from '#models/system_setting_system_module'
import { SystemSettingFilterSearchInterface } from '../interfaces/system_setting_filter_search_interface.js'

export default class SystemSettingService {
  async index(filters: SystemSettingFilterSearchInterface) {
    const systemSettings = await SystemSetting.query()
      .whereNull('system_setting_deleted_at')
      .if(filters.search, (query) => {
        query.where((subQuery) => {
          subQuery.whereRaw('UPPER(system_setting_trade_name) LIKE ?', [
            `%${filters.search.toUpperCase()}%`,
          ])
        })
      })
      .orderBy('system_setting_id')
      .paginate(filters.page, filters.limit)
    return systemSettings
  }

  async create(systemSetting: SystemSetting) {
    const newSystemSetting = new SystemSetting()
    newSystemSetting.systemSettingTradeName = systemSetting.systemSettingTradeName
    newSystemSetting.systemSettingSidebarColor = systemSetting.systemSettingSidebarColor
    newSystemSetting.systemSettingLogo = systemSetting.systemSettingLogo
    newSystemSetting.systemSettingActive = systemSetting.systemSettingActive
    await newSystemSetting.save()
    return newSystemSetting
  }

  async update(currentSystemSetting: SystemSetting, systemSetting: SystemSetting) {
    currentSystemSetting.systemSettingTradeName = systemSetting.systemSettingTradeName
    currentSystemSetting.systemSettingSidebarColor = systemSetting.systemSettingSidebarColor
    currentSystemSetting.systemSettingLogo = systemSetting.systemSettingLogo
    currentSystemSetting.systemSettingActive = systemSetting.systemSettingActive
    await currentSystemSetting.save()
    return currentSystemSetting
  }

  async delete(currentSystemSetting: SystemSetting) {
    await currentSystemSetting.delete()
    return currentSystemSetting
  }

  async show(systemSettingId: number) {
    const systemSetting = await SystemSetting.query()
      .whereNull('system_setting_deleted_at')
      .where('system_setting_id', systemSettingId)
      .preload('systemSettingSystemModules')
      .first()
    return systemSetting ? systemSetting : null
  }

  async getActive() {
    const systemSetting = await SystemSetting.query()
      .whereNull('system_setting_deleted_at')
      .where('system_setting_active', 1)
      .first()
    return systemSetting
  }

  async verifyInfo(systemSetting: SystemSetting) {
    const action = systemSetting.systemSettingId > 0 ? 'updated' : 'created'
    const existTradeName = await SystemSetting.query()
      .if(systemSetting.systemSettingId > 0, (query) => {
        query.whereNot('system_setting_id', systemSetting.systemSettingId)
      })
      .whereNull('system_setting_deleted_at')
      .where('system_setting_trade_name', systemSetting.systemSettingTradeName)
      .first()

    if (existTradeName) {
      return {
        status: 400,
        type: 'warning',
        title: 'The system setting trade name exists for another system setting',
        message: `The system setting resource cannot be ${action} because the system setting trade name is already assigned to another system setting`,
        data: { ...systemSetting },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...systemSetting },
    }
  }

  async verifyActiveStore(systemSetting: SystemSetting) {
    const action = systemSetting.systemSettingId > 0 ? 'updated' : 'created'
    if (systemSetting.systemSettingActive) {
      const activeItem = await SystemSetting.query()
        .where('system_setting_active', 1)
        .whereNull('system_setting_deleted_at')
        .first()
      if (activeItem) {
        return {
          status: 400,
          type: 'warning',
          title: 'The system setting status',
          message: `The system setting resource cannot be ${action} because only one record can be active`,
          data: { ...systemSetting },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...systemSetting },
    }
  }

  async verifyActiveUpdate(systemSetting: SystemSetting, currentSystemSetting: SystemSetting) {
    const action = systemSetting.systemSettingId > 0 ? 'updated' : 'created'
    if (systemSetting.systemSettingId > 0) {
      if (systemSetting.systemSettingActive && !currentSystemSetting.systemSettingActive) {
        const activeItem = await SystemSetting.query()
          .where('system_setting_active', 1)
          .whereNull('system_setting_deleted_at')
          .first()
        if (activeItem && activeItem.systemSettingId !== currentSystemSetting.systemSettingId) {
          return {
            status: 400,
            type: 'warning',
            title: 'The system setting status',
            message: `The system setting resource cannot be ${action} because only one record can be active`,
            data: { ...systemSetting },
          }
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...systemSetting },
    }
  }

  async assignSystemModules(systemSettingId: number, systemModules: Array<number>) {
    let systemSettingSystemModules = await SystemSettingSystemModule.query()
      .whereNull('system_setting_system_module_deleted_at')
      .where('system_setting_id', systemSettingId)
    if (systemSettingSystemModules) {
      if (systemModules === undefined) {
        systemModules = []
      }
      for await (const item of systemSettingSystemModules) {
        const existSystemModule = systemModules.find(
          (a: number) => Number.parseInt(a.toString()) === item.systemModuleId
        )
        if (!existSystemModule) {
          await item.delete()
        }
      }
    }
    for await (const systemModuleId of systemModules) {
      const existSystemSettingSystemModules = systemSettingSystemModules.find(
        (a) => a.systemModuleId === Number.parseInt(systemModuleId.toString())
      )
      if (!existSystemSettingSystemModules) {
        const newSystemSettingSystemModules = new SystemSettingSystemModule()
        newSystemSettingSystemModules.systemSettingId = systemSettingId
        newSystemSettingSystemModules.systemModuleId = systemModuleId
        await newSystemSettingSystemModules.save()
      }
    }
    systemSettingSystemModules = await SystemSettingSystemModule.query()
      .whereNull('system_setting_system_module_deleted_at')
      .where('system_setting_id', systemSettingId)
    return systemSettingSystemModules
  }
}
