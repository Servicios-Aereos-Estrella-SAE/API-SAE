import Employee from '#models/employee'
import BiometricEmployeeInterface from '../interfaces/biometric_employee_interface.js'
import DepartmentService from './department_service.js'
import PositionService from './position_service.js'

export default class EmployeeService {
  async syncCreate(
    employee: BiometricEmployeeInterface,
    departmentService: DepartmentService,
    positionService: PositionService
  ) {
    const newEmployee = new Employee()
    newEmployee.employeeSyncId = employee.id
    newEmployee.employeeStatus = employee.status
    newEmployee.employeeCode = employee.empCode
    newEmployee.employeeFirstName = employee.firstName
    newEmployee.employeeLastName = employee.lastName
    newEmployee.employeeNickname = employee.nickname
    newEmployee.employeePassport = employee.passport
    newEmployee.employeeDriverLicenseAutomobile = employee.driverLicenseAutomobile
    newEmployee.employeeDriverLicenseMotorcycle = employee.driverLicenseMotorcycle
    newEmployee.employeePhoto = employee.photo
    newEmployee.employeeSelfPassword = employee.selfPassword
    newEmployee.employeeDevicePassword = employee.devicePassword
    newEmployee.employeeDevPrivilege = employee.devPrivilege
    newEmployee.employeeCardNo = employee.cardNo
    newEmployee.employeeAccGroup = employee.accGroup
    newEmployee.employeeAccTimezone = employee.accTimezone
    newEmployee.employeeGender = employee.gender
    newEmployee.employeeBirthday = employee.birthday
    newEmployee.employeeAddress = employee.address
    newEmployee.employeePostcode = employee.postcode
    newEmployee.employeeOfficeTel = employee.officeTel
    newEmployee.employeeContactTel = employee.contactTel
    newEmployee.employeeMobile = employee.mobile
    newEmployee.employeeNationalNum = employee.nationalNum
    newEmployee.employeePayrollNum = employee.payrollNum
    newEmployee.employeeInternalNum = employee.internalEmpNum
    newEmployee.employeeNational = employee.national
    newEmployee.employeeReligion = employee.religion
    newEmployee.employeeTitle = employee.title
    newEmployee.employeeEnrollSn = employee.enrollSn
    newEmployee.employeeSsn = employee.ssn
    newEmployee.employeeHireDate = employee.hireDate
    newEmployee.employeeVerifyMode = employee.verifyMode
    newEmployee.employeeCity = employee.city
    newEmployee.employeeIsAdmin = employee.isAdmin
    newEmployee.employeeType = employee.empType
    newEmployee.employeeEnableAtt = employee.enableAtt
    newEmployee.employeeEnablePayroll = employee.enablePayroll
    newEmployee.employeeEnableOvertime = employee.enableOvertime
    newEmployee.employeeEnableHoliday = employee.enableHoliday
    newEmployee.employeeDeleted = employee.deleted
    newEmployee.employeeReserved = employee.reserved
    newEmployee.employeeDelTag = employee.delTag
    newEmployee.employeeAppStatus = employee.appStatus
    newEmployee.employeeAppRole = employee.appRole
    newEmployee.employeeEmail = employee.email
    newEmployee.employeeLastLogin = employee.lastLogin
    newEmployee.employeeActive = employee.isActive
    newEmployee.employeeVacationRule = employee.vacationRule
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
    newEmployee.employeeCreateUser = employee.createUser
    newEmployee.employeeChangeUser = employee.changeUser
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
    currentEmployee.employeeSyncId = employee.id
    currentEmployee.employeeStatus = employee.status
    currentEmployee.employeeCode = employee.empCode
    currentEmployee.employeeFirstName = employee.firstName
    currentEmployee.employeeLastName = employee.lastName
    currentEmployee.employeeNickname = employee.nickname
    currentEmployee.employeePassport = employee.passport
    currentEmployee.employeeDriverLicenseAutomobile = employee.driverLicenseAutomobile
    currentEmployee.employeeDriverLicenseMotorcycle = employee.driverLicenseMotorcycle
    currentEmployee.employeePhoto = employee.photo
    currentEmployee.employeeSelfPassword = employee.selfPassword
    currentEmployee.employeeDevicePassword = employee.devicePassword
    currentEmployee.employeeDevPrivilege = employee.devPrivilege
    currentEmployee.employeeCardNo = employee.cardNo
    currentEmployee.employeeAccGroup = employee.accGroup
    currentEmployee.employeeAccTimezone = employee.accTimezone
    currentEmployee.employeeGender = employee.gender
    currentEmployee.employeeBirthday = employee.birthday
    currentEmployee.employeeAddress = employee.address
    currentEmployee.employeePostcode = employee.postcode
    currentEmployee.employeeOfficeTel = employee.officeTel
    currentEmployee.employeeContactTel = employee.contactTel
    currentEmployee.employeeMobile = employee.mobile
    currentEmployee.employeeNationalNum = employee.nationalNum
    currentEmployee.employeePayrollNum = employee.payrollNum
    currentEmployee.employeeInternalNum = employee.internalEmpNum
    currentEmployee.employeeNational = employee.national
    currentEmployee.employeeReligion = employee.religion
    currentEmployee.employeeTitle = employee.title
    currentEmployee.employeeEnrollSn = employee.enrollSn
    currentEmployee.employeeSsn = employee.ssn
    currentEmployee.employeeHireDate = employee.hireDate
    currentEmployee.employeeVerifyMode = employee.verifyMode
    currentEmployee.employeeCity = employee.city
    currentEmployee.employeeIsAdmin = employee.isAdmin
    currentEmployee.employeeType = employee.empType
    currentEmployee.employeeEnableAtt = employee.enableAtt
    currentEmployee.employeeEnablePayroll = employee.enablePayroll
    currentEmployee.employeeEnableOvertime = employee.enableOvertime
    currentEmployee.employeeEnableHoliday = employee.enableHoliday
    currentEmployee.employeeDeleted = employee.deleted
    currentEmployee.employeeReserved = employee.reserved
    currentEmployee.employeeDelTag = employee.delTag
    currentEmployee.employeeAppStatus = employee.appStatus
    currentEmployee.employeeAppRole = employee.appRole
    currentEmployee.employeeEmail = employee.email
    currentEmployee.employeeLastLogin = employee.lastLogin
    currentEmployee.employeeActive = employee.isActive
    currentEmployee.employeeVacationRule = employee.vacationRule
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
    currentEmployee.employeeCreateUser = employee.createUser
    currentEmployee.employeeChangeUser = employee.changeUser
    currentEmployee.employeeLastSynchronizationAt = new Date()
    await currentEmployee.save()
    return currentEmployee
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
