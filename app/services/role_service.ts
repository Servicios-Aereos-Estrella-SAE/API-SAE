import Role from '#models/role'
import { RoleFilterSearchInterface } from '../interfaces/role_filter_search_interface.js'

export default class RoleService {
  async index(filters: RoleFilterSearchInterface) {
    const roles = await Role.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(role_name) LIKE ?', [`%${filters.search.toUpperCase()}%`])
      })
      .preload('roleSystemPermissions')
      .orderBy('role_id')
      .paginate(filters.page, filters.limit)
    return roles
  }
}
