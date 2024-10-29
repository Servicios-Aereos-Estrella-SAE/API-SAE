import Department from '#models/department'
import { cuid } from '@adonisjs/core/helpers'
import BiometricDepartmentInterface from '../interfaces/biometric_department_interface.js'
import BiometricPositionInterface from '../interfaces/biometric_position_interface.js'
import PositionService from './position_service.js'
import DepartmentPosition from '#models/department_position'
import { DepartmentShiftFilterInterface } from '../interfaces/department_shift_filter_interface.js'
import Shift from '#models/shift'
import EmployeeShiftService from './employee_shift_service.js'
import EmployeeService from './employee_service.js'
import { DepartmentShiftEmployeeWarningInterface } from '../interfaces/department_shift_employee_warning_interface.js'
import EmployeeShift from '#models/employee_shift'
import env from '#start/env'
import BusinessUnit from '#models/business_unit'

export default class DepartmentService {
  async index(departmentsList: Array<number>) {
    const businessConf = `${env.get('SYSTEM_BUSINESS')}`
    const businessList = businessConf.split(',')
    const businessUnits = await BusinessUnit.query()
      .where('business_unit_active', 1)
      .whereIn('business_unit_slug', businessList)

    const businessUnitsList = businessUnits.map((business) => business.businessUnitId)

    const departments = await Department.query()
      .whereIn('businessUnitId', businessUnitsList)
      .whereIn('departmentId', departmentsList)
      .orderBy('departmentId', 'asc')

    return departments
  }

  async buildOrganization(departmentList: number[]) {
    const businessConf = `${env.get('SYSTEM_BUSINESS')}`
    const businessList = businessConf.split(',')
    const businessUnits = await BusinessUnit.query()
      .where('business_unit_active', 1)
      .whereIn('business_unit_slug', businessList)

    const businessUnitsList = businessUnits.map((business) => business.businessUnitId)

    const departments = await Department.query()
      .whereIn('businessUnitId', businessUnitsList)
      .whereIn('departmentId', departmentList)
      .whereNull('parentDepartmentId')
      .orderBy('departmentId', 'asc')
      .preload('subDepartments', (child) => {
        child.whereIn('businessUnitId', businessUnitsList)
        child.preload('departmentsPositions', (deptQuery) => {
          deptQuery.whereHas('position', (position) => {
            position.whereNull('parentPositionId')
          })
          deptQuery.preload('position', (position) => {
            position.whereNull('parentPositionId')
            position.preload('subPositions')
          })
        })
      })
      .preload('departmentsPositions', (deptQuery) => {
        deptQuery.whereHas('position', (position) => {
          position.whereNull('parentPositionId')
        })
        deptQuery.preload('position', (position) => {
          position.whereNull('parentPositionId')
          position.preload('subPositions')
        })
      })

    return departments
  }

  async syncCreate(department: BiometricDepartmentInterface) {
    const newDepartment = new Department()
    newDepartment.departmentSyncId = department.id
    newDepartment.parentDepartmentSyncId = department.parentDeptId
    newDepartment.departmentCode = department.deptCode
    newDepartment.departmentName = department.deptName
    newDepartment.departmentIsDefault = department.isDefault
    newDepartment.departmentActive = 1
    newDepartment.parentDepartmentId = department.parentDeptId
      ? await this.getIdBySyncId(department.parentDeptId)
      : null
    newDepartment.companyId = department.companyId
    newDepartment.departmentLastSynchronizationAt = new Date()
    await newDepartment.save()
    return newDepartment
  }

  async syncUpdate(department: BiometricDepartmentInterface, currentDepartment: Department) {
    currentDepartment.parentDepartmentSyncId = department.parentDeptId
    currentDepartment.departmentCode = department.deptCode
    currentDepartment.departmentName = department.deptName
    currentDepartment.departmentIsDefault = department.isDefault
    currentDepartment.parentDepartmentId = department.parentDeptId
      ? await this.getIdBySyncId(department.parentDeptId)
      : null
    currentDepartment.companyId = department.companyId
    currentDepartment.departmentLastSynchronizationAt = new Date()
    await currentDepartment.save()
    return currentDepartment
  }

  async create(department: Department) {
    const newDepartment = new Department()
    newDepartment.departmentCode = department.departmentCode
    newDepartment.departmentName = department.departmentName
    newDepartment.departmentAlias = department.departmentAlias
    newDepartment.departmentIsDefault = department.departmentIsDefault
    newDepartment.departmentActive = department.departmentActive
    newDepartment.parentDepartmentId = department.parentDepartmentId
    newDepartment.companyId = department.companyId
    await newDepartment.save()
    return newDepartment
  }

  async update(currentDepartment: Department, department: Department) {
    currentDepartment.departmentCode = department.departmentCode
    currentDepartment.departmentName = department.departmentName
    currentDepartment.departmentAlias = department.departmentAlias
    currentDepartment.departmentIsDefault = department.departmentIsDefault
    currentDepartment.departmentActive = department.departmentActive
    currentDepartment.parentDepartmentId = department.parentDepartmentId
    currentDepartment.companyId = department.companyId
    await currentDepartment.save()
    return currentDepartment
  }

  async delete(currentDepartment: Department) {
    await currentDepartment.delete()
    return currentDepartment
  }

  async getIdBySyncId(departmentSyncId: number) {
    const department = await Department.query()
      .where('department_sync_id', departmentSyncId)
      .first()
    if (department) {
      return department.departmentId
    } else {
      return 0
    }
  }

  async showSync(departmentSyncId: number) {
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
      positionName: department.departmentName,
      positionCode: cuid(),
      isDefault: false,
      companyId: department.companyId,
      parentPositionId: 0,
    }
    const position = await positionService.syncCreate(newPosition)
    return position ? position.positionId : 0
  }

  async show(departmentId: number) {
    const department = await Department.query()
      .whereNull('department_deleted_at')
      .where('department_id', departmentId)
      .first()
    return department ? department : null
  }

  async assignShift(filters: DepartmentShiftFilterInterface) {
    const employeeShiftService = new EmployeeShiftService()
    if (!employeeShiftService.isValidDate(filters.applySince)) {
      return {
        status: 400,
        type: 'error',
        title: 'Validation error',
        message: 'Date is invalid',
        data: null,
      }
    }
    const page = 1
    const limit = 999999999999999
    const employeeService = new EmployeeService()
    const departmentId = filters.departmentId
    const departmentPositions = await DepartmentPosition.query()
      .whereNull('department_position_deleted_at')
      .where('department_id', departmentId)
      .orderBy('position_id')
    const warnings = [] as Array<DepartmentShiftEmployeeWarningInterface>
    for await (const position of departmentPositions) {
      const resultEmployes = await employeeService.index(
        {
          search: '',
          departmentId: departmentId,
          positionId: position.positionId,
          page: page,
          limit: limit,
          employeeWorkSchedule: '',
        },
        [departmentId]
      )
      const dataEmployes: any = resultEmployes
      for await (const employee of dataEmployes) {
        const employeeShift = {
          employeeId: employee.employeeId,
          shiftId: filters.shiftId,
          employeShiftsApplySince: employeeShiftService.getDateAndTime(filters.applySince),
        } as EmployeeShift
        const verifyInfo = await employeeShiftService.verifyInfo(employeeShift)
        if (verifyInfo.status !== 200) {
          warnings.push({
            status: verifyInfo.status,
            type: verifyInfo.type,
            title: verifyInfo.title,
            message: verifyInfo.message,
            employee: employee,
          })
        } else {
          await EmployeeShift.create(employeeShift)
        }
      }
    }
    return {
      status: 201,
      type: 'success',
      title: 'Successfully action',
      message: 'Resource created',
      data: { warnings },
    }
  }

  async verifyInfoExist(department: Department) {
    if (department.parentDepartmentId) {
      const existDepartmentParent = await Department.query()
        .whereNull('department_deleted_at')
        .where('department_id', department.parentDepartmentId)
        .first()

      if (!existDepartmentParent && department.parentDepartmentId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The department parent was not found',
          message: 'The department parent was not found with the entered ID',
          data: { ...department },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...department },
    }
  }

  async verifyInfo(department: Department) {
    const action = department.departmentId > 0 ? 'updated' : 'created'
    const existCode = await Department.query()
      .if(department.departmentId > 0, (query) => {
        query.whereNot('department_id', department.departmentId)
      })
      .whereNull('department_deleted_at')
      .where('department_code', department.departmentCode)
      .first()

    if (existCode && department.departmentCode) {
      return {
        status: 400,
        type: 'warning',
        title: 'The department code already exists for another department',
        message: `The department resource cannot be ${action} because the code is already assigned to another department`,
        data: { ...department },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...department },
    }
  }

  async verifyInfoAssignShift(filter: DepartmentShiftFilterInterface) {
    const departmentId = filter.departmentId
    const shiftId = filter.shiftId
    if (!departmentId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The department Id was not found',
        message: 'Missing data to process',
        data: { departmentId },
      }
    }
    const currentDepartment = await Department.query()
      .whereNull('department_deleted_at')
      .where('department_id', departmentId)
      .first()
    if (!currentDepartment) {
      return {
        status: 404,
        type: 'warning',
        title: 'The department was not found',
        message: 'The department was not found with the entered ID',
        data: { departmentId },
      }
    }
    if (!shiftId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The shift Id was not found',
        message: 'Missing data to process',
        data: { shiftId },
      }
    }
    const currentShift = await Shift.query()
      .whereNull('shift_deleted_at')
      .where('shift_id', shiftId)
      .first()
    if (!currentShift) {
      return {
        status: 404,
        type: 'warning',
        title: 'The shift was not found',
        message: 'The shift was not found with the entered ID',
        data: { shiftId },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...filter },
    }
  }

  async getPositions(departmentId: number) {
    const positions = await DepartmentPosition.query()
      .where('department_id', departmentId)
      .preload('position')
      .orderBy('position_id')
    return positions
  }
}
