import Department from '#models/department'
import BiometricDepartmentInterface from '../interfaces/biometric_department_interface.js'

export default class DepartmentService {
  async create(department: BiometricDepartmentInterface) {
    const newDepartment = new Department()
    newDepartment.department_sync_id = department.id
    newDepartment.department_code = department.deptCode
    newDepartment.department_name = department.deptName
    newDepartment.department_is_default = department.isDefault
    newDepartment.department_active = 1
    newDepartment.parent_department_id = department.parentDeptId
    newDepartment.company_id = department.companyId
    newDepartment.department_last_synchronization_at = new Date()
    await newDepartment.save()
    return newDepartment
  }

  async update(department: BiometricDepartmentInterface, currentDepartment: Department) {
    currentDepartment.department_code = department.deptCode
    currentDepartment.department_name = department.deptName
    currentDepartment.department_is_default = department.isDefault
    currentDepartment.parent_department_id = department.parentDeptId
    currentDepartment.company_id = department.companyId
    currentDepartment.department_last_synchronization_at = new Date()
    await currentDepartment.save()
    return currentDepartment
  }
}
