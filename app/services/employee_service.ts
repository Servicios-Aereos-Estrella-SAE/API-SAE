import Employee from '#models/employee'
import BiometricEmployeeInterface from '../interfaces/biometric_employee_interface.js'
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
    await newEmployee.save()
    return newEmployee
  }

  async getNewPosition(
    employee: BiometricEmployeeInterface,
    positionService: PositionService,
    departmentService: DepartmentService
  ) {
    let positionId = 0
    const department = await departmentService.show(employee.departmentId)
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
}
