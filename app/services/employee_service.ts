import Department from '#models/department'
import Employee from '#models/employee'
import Person from '#models/person'
import Position from '#models/position'
import BiometricEmployeeInterface from '../interfaces/biometric_employee_interface.js'
import { EmployeeFilterSearchInterface } from '../interfaces/employee_filter_search_interface.js'
import DepartmentService from './department_service.js'
import PersonService from './person_service.js'
import PositionService from './position_service.js'

export default class EmployeeService {
  async syncCreate(
    employee: BiometricEmployeeInterface,
    departmentService: DepartmentService,
    positionService: PositionService
  ) {
    const newEmployee = new Employee()
    const personService = new PersonService()
    const newPerson = await personService.syncCreate(employee)
    if (newPerson) {
      newEmployee.personId = newPerson.personId
    }
    newEmployee.employeeSyncId = employee.id
    newEmployee.employeeCode = employee.empCode
    newEmployee.employeeFirstName = employee.firstName
    newEmployee.employeeLastName = employee.lastName
    newEmployee.employeePayrollNum = employee.payrollNum
    newEmployee.employeeHireDate = employee.hireDate
    newEmployee.companyId = employee.companyId
    newEmployee.departmentId = await departmentService.getIdBySyncId(employee.departmentId)
    newEmployee.positionId = await positionService.getIdBySyncId(employee.positionId)
    newEmployee.departmentSyncId = employee.departmentId
    const positionRealId = await positionService.getIdBySyncId(employee.positionId)
    if (positionRealId) {
      newEmployee.positionId = positionRealId
    } else {
      newEmployee.positionId = await this.getNewPosition(
        employee,
        positionService,
        departmentService
      )
    }
    newEmployee.employeeLastSynchronizationAt = new Date()
    await newEmployee.save()
    return newEmployee
  }

  async syncUpdate(
    employee: BiometricEmployeeInterface,
    currentEmployee: Employee,
    departmentService: DepartmentService,
    positionService: PositionService
  ) {
    if (!currentEmployee.personId) {
      const personService = new PersonService()
      const newPerson = await personService.syncCreate(employee)
      currentEmployee.personId = newPerson ? newPerson.personId : 0
    }
    currentEmployee.employeeSyncId = employee.id
    currentEmployee.employeeCode = employee.empCode
    currentEmployee.employeeFirstName = employee.firstName
    currentEmployee.employeeLastName = employee.lastName
    currentEmployee.employeePayrollNum = employee.payrollNum
    currentEmployee.employeeHireDate = employee.hireDate
    currentEmployee.companyId = employee.companyId
    currentEmployee.departmentId = await departmentService.getIdBySyncId(employee.departmentId)
    const positionRealId = await positionService.getIdBySyncId(employee.positionId)
    if (positionRealId) {
      currentEmployee.positionId = positionRealId
    } else {
      currentEmployee.positionId = await this.getNewPosition(
        employee,
        positionService,
        departmentService
      )
    }
    currentEmployee.departmentSyncId = employee.departmentId
    currentEmployee.positionSyncId = employee.positionId
    currentEmployee.employeeLastSynchronizationAt = new Date()
    await currentEmployee.save()
    return currentEmployee
  }

  async index(filters: EmployeeFilterSearchInterface) {
    const employees = await Employee.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(CONCAT(employee_first_name, " ", employee_last_name)) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
        query.orWhereRaw('UPPER(employee_code) = ?', [`${filters.search.toUpperCase()}`])
      })
      .if(filters.departmentId && filters.positionId, (query) => {
        query.where('department_id', filters.departmentId)
        query.where('position_id', filters.positionId)
      })
      .preload('department')
      .preload('position')
      .orderBy('employee_id')
      .paginate(filters.page, filters.limit)
    return employees
  }

  async create(employee: Employee) {
    const newEmployee = new Employee()
    newEmployee.employeeFirstName = employee.employeeFirstName
    newEmployee.employeeLastName = employee.employeeLastName
    newEmployee.employeeCode = employee.employeeCode
    newEmployee.employeePayrollNum = employee.employeePayrollNum
    newEmployee.employeeHireDate = employee.employeeHireDate
    newEmployee.companyId = employee.companyId
    newEmployee.departmentId = await employee.departmentId
    newEmployee.positionId = await employee.positionId
    newEmployee.personId = await employee.personId
    await newEmployee.save()
    return newEmployee
  }

  async update(currentEmployee: Employee, employee: Employee) {
    currentEmployee.employeeFirstName = employee.employeeFirstName
    currentEmployee.employeeLastName = employee.employeeLastName
    currentEmployee.employeeCode = employee.employeeCode
    currentEmployee.employeePayrollNum = employee.employeePayrollNum
    currentEmployee.employeeHireDate = employee.employeeHireDate
    currentEmployee.companyId = employee.companyId
    currentEmployee.departmentId = await employee.departmentId
    currentEmployee.positionId = await employee.positionId
    await currentEmployee.save()
    return currentEmployee
  }

  async delete(currentEmployee: Employee) {
    await currentEmployee.delete()
    return currentEmployee
  }

  async show(employeeId: number) {
    const employee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeId)
      .first()
    return employee ? employee : null
  }

  async getNewPosition(
    employee: BiometricEmployeeInterface,
    positionService: PositionService,
    departmentService: DepartmentService
  ) {
    let positionId = 0
    const department = await departmentService.showSync(employee.departmentId)
    if (department) {
      const existPosition = await positionService.verifyExistPositionByName(
        department.departmentName
      )
      if (existPosition) {
        positionId = existPosition
      } else {
        positionId = await departmentService.addPosition(department)
      }
    }
    return positionId
  }

  async verifyInfoExist(employee: Employee) {
    const existDepartment = await Department.query()
      .whereNull('department_deleted_at')
      .where('department_id', employee.departmentId)
      .first()

    if (!existDepartment && employee.departmentId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The department was not found',
        message: 'The department was not found with the entered ID',
        data: { ...employee },
      }
    }

    const existPosition = await Position.query()
      .whereNull('position_deleted_at')
      .where('position_id', employee.positionId)
      .first()

    if (!existPosition && employee.positionId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The position was not found',
        message: 'The position was not found with the entered ID',
        data: { ...employee },
      }
    }
    if (!employee.employeeId) {
      const existPerson = await Person.query()
        .whereNull('person_deleted_at')
        .where('person_id', employee.personId)
        .first()

      if (!existPerson && employee.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person was not found',
          message: 'The person was not found with the entered ID',
          data: { ...employee },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifi successfully',
      data: { ...employee },
    }
  }

  async verifyInfo(employee: Employee) {
    const action = employee.employeeId > 0 ? 'updated' : 'created'
    const existCode = await Employee.query()
      .if(employee.employeeId > 0, (query) => {
        query.whereNot('employee_id', employee.employeeId)
      })
      .whereNull('employee_deleted_at')
      .where('employee_code', employee.employeeCode)
      .first()

    if (existCode && employee.employeeCode) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee code already exists for another employee',
        message: `The employee resource cannot be ${action} because the code is already assigned to another employee`,
        data: { ...employee },
      }
    }
    const existPayrollNum = await Employee.query()
      .if(employee.employeeId > 0, (query) => {
        query.whereNot('employee_id', employee.employeeId)
      })
      .whereNull('employee_deleted_at')
      .where('employee_payroll_num', employee.employeePayrollNum)
      .first()

    if (existPayrollNum && employee.employeePayrollNum) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee payroll num already exists for another employee',
        message: `The employee resource cannot be ${action} because the payroll num is already assigned to another employee`,
        data: { ...employee },
      }
    }
    if (!employee.employeeId) {
      const existPersonId = await Employee.query()
        .if(employee.employeeId > 0, (query) => {
          query.whereNot('employee_id', employee.employeeId)
        })
        .whereNull('employee_deleted_at')
        .where('person_id', employee.personId)
        .first()

      if (existPersonId && employee.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The employee person id exists for another employee',
          message: `The employee resource cannot be ${action} because the person id is already assigned to another employee`,
          data: { ...employee },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifi successfully',
      data: { ...employee },
    }
  }
}
