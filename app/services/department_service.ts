import Department from '#models/department'
import BiometricDepartmentInterface from '../interfaces/biometric_department_interface.js'

export default class DepartmentService {
  async create(department: BiometricDepartmentInterface) {
    const newDepartment = new Department()
    newDepartment.department_sync_id = department.id
    newDepartment.parent_department_sync_id = department.parentDeptId
    newDepartment.department_code = department.deptCode
    newDepartment.department_name = department.deptName
    newDepartment.department_is_default = department.isDefault
    newDepartment.department_active = 1
    newDepartment.parent_department_id = department.parentDeptId
      ? await this.getIdBySyncId(department.parentDeptId)
      : null
    newDepartment.company_id = department.companyId
    newDepartment.department_last_synchronization_at = new Date()
    await newDepartment.save()
    return newDepartment
  }

  async update(department: BiometricDepartmentInterface, currentDepartment: Department) {
    currentDepartment.parent_department_sync_id = department.parentDeptId
    currentDepartment.department_code = department.deptCode
    currentDepartment.department_name = department.deptName
    currentDepartment.department_is_default = department.isDefault
    currentDepartment.parent_department_id = department.parentDeptId
      ? await this.getIdBySyncId(department.parentDeptId)
      : null
    currentDepartment.company_id = department.companyId
    currentDepartment.department_last_synchronization_at = new Date()
    await currentDepartment.save()
    return currentDepartment
  }

  async getIdBySyncId(departmentSyncId: number) {
    const department = await Department.query()
      .where('department_sync_id', departmentSyncId)
      .first()
    if (department) {
      return department.department_id
    } else {
      return 0
    }
  }

  async show(departmentSyncId: number) {
    const department = await Department.query()
      .where('department_sync_id', departmentSyncId)
      .first()
    if (department) {
      return department
    } else {
      return null
    }
  }
}
