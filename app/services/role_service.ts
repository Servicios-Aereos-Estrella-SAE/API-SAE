import Department from '#models/department'
import Role from '#models/role'
import RoleDepartment from '#models/role_department'
import RoleSystemPermission from '#models/role_system_permission'
import SystemModule from '#models/system_module'
import SystemPermission from '#models/system_permission'
import { RoleFilterSearchInterface } from '../interfaces/role_filter_search_interface.js'

export default class RoleService {
  async index(filters: RoleFilterSearchInterface) {
    const roles = await Role.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(role_name) LIKE ?', [`%${filters.search.toUpperCase()}%`])
      })
      .preload('roleDepartments')
      .preload('roleSystemPermissions')
      .orderBy('role_id')
      .paginate(filters.page, filters.limit)
    return roles
  }

  async assignPermissions(roleId: number, permissions: Array<number>) {
    let rolePermissions = await RoleSystemPermission.query()
      .whereNull('role_system_permission_deleted_at')
      .where('role_id', roleId)
    if (rolePermissions) {
      if (permissions === undefined) {
        permissions = []
      }
      for await (const item of rolePermissions) {
        const existPermission = permissions.find(
          (a: number) => Number.parseInt(a.toString()) === item.systemPermissionId
        )
        if (!existPermission) {
          await item.delete()
        }
      }
    }
    for await (const permissionId of permissions) {
      const existRoleSystemPermission = rolePermissions.find(
        (a) => a.systemPermissionId === Number.parseInt(permissionId.toString())
      )
      if (!existRoleSystemPermission) {
        const newPermission = new RoleSystemPermission()
        newPermission.roleId = roleId
        newPermission.systemPermissionId = permissionId
        await newPermission.save()
      }
    }
    rolePermissions = await RoleSystemPermission.query()
      .whereNull('role_system_permission_deleted_at')
      .where('role_id', roleId)
    return rolePermissions
  }

  async assignDepartments(roleId: number, departments: Array<number>) {
    let roleDepartments = await RoleDepartment.query()
      .whereNull('role_department_deleted_at')
      .where('role_id', roleId)
    if (roleDepartments) {
      if (departments === undefined) {
        departments = []
      }
      for await (const item of roleDepartments) {
        const existDepartment = departments.find(
          (a: number) => Number.parseInt(a.toString()) === item.departmentId
        )
        if (!existDepartment) {
          await item.delete()
        }
      }
    }
    for await (const departmentId of departments) {
      const existRoleDepartment = roleDepartments.find(
        (a) => a.departmentId === Number.parseInt(departmentId.toString())
      )
      if (!existRoleDepartment) {
        const newRoleDepartment = new RoleDepartment()
        newRoleDepartment.roleId = roleId
        newRoleDepartment.departmentId = departmentId
        await newRoleDepartment.save()
      }
    }
    roleDepartments = await RoleDepartment.query()
      .whereNull('role_department_deleted_at')
      .where('role_id', roleId)
    return roleDepartments
  }

  async show(roleId: number) {
    const role = await Role.query()
      .whereNull('role_deleted_at')
      .where('role_id', roleId)
      .preload('roleSystemPermissions')
      .first()
    return role ? role : null
  }

  async hasAccess(roleId: number, systemModuleSlug: string, action: string) {
    const role = await Role.query().whereNull('role_deleted_at').where('role_id', roleId).first()
    if (!role) {
      return false
    }
    const systemModule = await SystemModule.query()
      .whereNull('system_module_deleted_at')
      .where('system_module_slug', systemModuleSlug)
      .where('system_module_active', 1)
      .first()

    if (!systemModule) {
      return false
    }

    const systemPermission = await SystemPermission.query()
      .whereNull('system_permission_deleted_at')
      .where('system_module_id', systemModule.systemModuleId)
      .where('system_permission_slug', action)
      .first()
    if (!systemPermission) {
      return false
    }

    const roleSystemPermissions = await RoleSystemPermission.query()
      .whereNull('role_system_permission_deleted_at')
      .where('role_id', roleId)
      .where('system_permission_id', systemPermission.systemPermissionId)
      .first()
    if (!roleSystemPermissions) {
      return false
    }
    return true
  }

  async hasAccessDepartment(roleId: number, departmentId: number) {
    const role = await Role.query().whereNull('role_deleted_at').where('role_id', roleId).first()
    if (!role) {
      return false
    }
    const department = await Department.query()
      .whereNull('department_deleted_at')
      .where('department_id', departmentId)
      .first()

    if (!department) {
      return false
    }

    const roleDepartment = await RoleDepartment.query()
      .whereNull('role_department_deleted_at')
      .where('role_id', roleId)
      .where('department_id', department.departmentId)
      .first()
    if (!roleDepartment) {
      return false
    }
    return true
  }

  async getAccess(roleId: number) {
    const role = await Role.query().whereNull('role_deleted_at').where('role_id', roleId).first()
    if (!role) {
      return {
        status: 404,
        type: 'warning',
        title: 'The role was not found',
        message: 'The role was not found with the entered ID',
        data: { roleId },
      }
    }

    const systemPermissions = await SystemPermission.query()
      .whereNull('system_permission_deleted_at')
      .orderBy('system_permission_id')
    const permissionsIds = []
    for await (const systemPermission of systemPermissions) {
      permissionsIds.push(systemPermission.systemPermissionId)
    }

    const roleSystemPermissions = await RoleSystemPermission.query()
      .whereNull('role_system_permission_deleted_at')
      .where('role_id', roleId)
      .whereIn('system_permission_id', permissionsIds)
      .preload('systemPermissions')
      .orderBy('role_system_permission_id')
    return {
      status: 200,
      type: 'success',
      title: 'Role system permissions',
      message: 'The system permissions were found successfully',
      data: roleSystemPermissions,
    }
  }

  async getAccessByModule(roleId: number, systemModuleSlug: string) {
    const role = await Role.query().whereNull('role_deleted_at').where('role_id', roleId).first()
    if (!role) {
      return {
        status: 404,
        type: 'warning',
        title: 'The role was not found',
        message: 'The role was not found with the entered ID',
        data: { roleId },
      }
    }
    const systemModule = await SystemModule.query()
      .whereNull('system_module_deleted_at')
      .where('system_module_slug', systemModuleSlug)
      .where('system_module_active', 1)
      .first()

    if (!systemModule) {
      return {
        status: 404,
        type: 'warning',
        title: 'The system module was not found',
        message: 'The system module was not found with the entered slug',
        data: { systemModuleSlug },
      }
    }

    const systemPermissions = await SystemPermission.query()
      .whereNull('system_permission_deleted_at')
      .where('system_module_id', systemModule.systemModuleId)
      .orderBy('system_permission_id')
    const permissionsIds = []
    for await (const systemPermission of systemPermissions) {
      permissionsIds.push(systemPermission.systemPermissionId)
    }

    const roleSystemPermissions = await RoleSystemPermission.query()
      .whereNull('role_system_permission_deleted_at')
      .where('role_id', roleId)
      .whereIn('system_permission_id', permissionsIds)
      .preload('systemPermissions')
      .orderBy('role_system_permission_id')
    return {
      status: 200,
      type: 'success',
      title: 'Role system permissions',
      message: 'The system permissions were found successfully',
      data: roleSystemPermissions,
    }
  }
}
