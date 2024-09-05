import SystemModule from '#models/system_module'
import { SystemModuleFilterSearchInterface } from '../interfaces/system.module_filter_search_interface.js'

export default class SystemModuleService {
  async index(filters: SystemModuleFilterSearchInterface) {
    const roles = await SystemModule.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(system_module_name) LIKE ?', [`%${filters.search.toUpperCase()}%`])
      })
      .preload('systemPermissions')
      .orderBy('system_module_id')
      .paginate(filters.page, filters.limit)
    return roles
  }

  async show(systemModuleSlug: string) {
    const systemModule = await SystemModule.query()
      .whereNull('system_module_deleted_at')
      .where('system_module_slug', systemModuleSlug)
      .preload('systemPermissions')
      .first()
    return systemModule ? systemModule : null
  }

  async getGroups() {
    const groups = await SystemModule.query()
      .select('system_module_group')
      .distinct('system_module_group')
      .orderBy('system_module_group')
    return groups
  }
}
