import Department from '#models/department'
import { cuid } from '@adonisjs/core/helpers'
import BiometricDepartmentInterface from '../interfaces/biometric_department_interface.js'
import BiometricPositionInterface from '../interfaces/biometric_position_interface.js'
import PositionService from './position_service.js'

export default class DepartmentService {
  async syncCreate(department: BiometricDepartmentInterface) {
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

  async syncUpdate(department: BiometricDepartmentInterface, currentDepartment: Department) {
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

  async addPosition(department: Department) {
    const positionService = new PositionService()
    const newPosition: BiometricPositionInterface = {
      id: 0,
      positionName: department.department_name,
      positionCode: cuid(),
      isDefault: false,
      companyId: department.company_id,
      parentPositionId: 0,
    }
    const position = await positionService.syncCreate(newPosition)
    return position ? position.position_id : 0
  }
}
