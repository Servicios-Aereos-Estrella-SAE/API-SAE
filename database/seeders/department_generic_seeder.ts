import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Department from '#models/department'

export default class extends BaseSeeder {
  async run() {
    const existingDepartment = await Department.find(999)

    if (!existingDepartment) {
      await Department.create({
        departmentId: 999,
        departmentSyncId: 999,
        departmentCode: 'SIN-DEP',
        departmentName: 'Sin Departamento',
        departmentAlias: 'Sin Dep',
        departmentIsDefault: false,
        departmentActive: 1,
        parentDepartmentId: null,
        parentDepartmentSyncId: 0,
        companyId: 1,
        departmentLastSynchronizationAt: new Date(),
      })
    }
  }
}
