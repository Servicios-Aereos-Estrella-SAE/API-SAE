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
}
