/* eslint-disable prettier/prettier */
import EmployeeContract from '#models/employee_contract'
import EmployeeContractType from '#models/employee_contract_type'
import Employee from '#models/employee'
import Department from '#models/department'
import Position from '#models/position'
import { DateTime } from 'luxon'

export default class EmployeeContractService {
  async create(employeeContract: EmployeeContract) {
    const newEmployeeContract = new EmployeeContract()
    newEmployeeContract.employeeContractUuid = employeeContract.employeeContractUuid
    newEmployeeContract.employeeContractFolio = employeeContract.employeeContractFolio
    newEmployeeContract.employeeContractStartDate = employeeContract.employeeContractStartDate
    newEmployeeContract.employeeContractEndDate = employeeContract.employeeContractEndDate
    newEmployeeContract.employeeContractStatus = employeeContract.employeeContractStatus
    newEmployeeContract.employeeContractMonthlyNetSalary = employeeContract.employeeContractMonthlyNetSalary
    newEmployeeContract.employeeContractFile = employeeContract.employeeContractFile
    newEmployeeContract.employeeContractTypeId = employeeContract.employeeContractTypeId
    newEmployeeContract.employeeId = employeeContract.employeeId
    newEmployeeContract.departmentId = employeeContract.departmentId
    newEmployeeContract.positionId = employeeContract.positionId
    await newEmployeeContract.save()
    await this.setHireDateFromFirstContract(employeeContract)
    await this.setDepartmentAndPositionFromLastContract(employeeContract)
    return newEmployeeContract
  }

  async update(currentEmployeeContract: EmployeeContract, employeeContract: EmployeeContract) {
    currentEmployeeContract.employeeContractUuid = employeeContract.employeeContractUuid
    currentEmployeeContract.employeeContractFolio = employeeContract.employeeContractFolio
    currentEmployeeContract.employeeContractStartDate = employeeContract.employeeContractStartDate
    currentEmployeeContract.employeeContractEndDate = employeeContract.employeeContractEndDate
    currentEmployeeContract.employeeContractStatus = employeeContract.employeeContractStatus
    currentEmployeeContract.employeeContractMonthlyNetSalary = employeeContract.employeeContractMonthlyNetSalary
    currentEmployeeContract.employeeContractFile = employeeContract.employeeContractFile
    currentEmployeeContract.employeeContractTypeId = employeeContract.employeeContractTypeId
    currentEmployeeContract.employeeId = employeeContract.employeeId
    currentEmployeeContract.departmentId = employeeContract.departmentId
    currentEmployeeContract.positionId = employeeContract.positionId
    await currentEmployeeContract.save()
    await this.setHireDateFromFirstContract(employeeContract)
    await this.setDepartmentAndPositionFromLastContract(employeeContract)
    return currentEmployeeContract
  }

  async delete(currentEmployeeContract: EmployeeContract) {
    await currentEmployeeContract.delete()
    return currentEmployeeContract
  }

  async show(employeeContractId: number) {
    const employeeContract = await EmployeeContract.query()
      .whereNull('employee_contract_deleted_at')
      .where('employee_contract_id', employeeContractId)
      .preload('employeeContractType')
      .first()
    return employeeContract ? employeeContract : null
  }

  async verifyInfoExist(employeeContract: EmployeeContract) {
    const existEmployeeContractType = await EmployeeContractType.query()
      .whereNull('employee_contract_type_deleted_at')
      .where('employee_contract_type_id', employeeContract.employeeContractTypeId)
      .first()

    if (!existEmployeeContractType && employeeContract.employeeContractTypeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee contract type was not found',
        message: 'The employee contract type was not found with the entered ID',
        data: { ...employeeContract },
      }
    }
    const existEmployee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeContract.employeeId)
      .first()

    if (!existEmployee && employeeContract.employeeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee was not found',
        message: 'The employee was not found with the entered ID',
        data: { ...employeeContract },
      }
    }
    const existDepartment = await Department.query()
      .whereNull('department_deleted_at')
      .where('department_id', employeeContract.departmentId)
      .first()

    if (!existDepartment && employeeContract.departmentId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The department was not found',
        message: 'The department was not found with the entered ID',
        data: { ...employeeContract },
      }
    }
    const existPosition = await Position.query()
      .whereNull('position_deleted_at')
      .where('position_id', employeeContract.positionId)
      .first()

    if (!existPosition && employeeContract.positionId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The position was not found',
        message: 'The position was not found with the entered ID',
        data: { ...employeeContract },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...employeeContract },
    }
  }

  async verifyInfo(employeeContract: EmployeeContract) {
    const action = employeeContract.employeeContractId > 0 ? 'updated' : 'created'
    const existEmployeeContract = await EmployeeContract.query()
      .whereNull('employee_contract_deleted_at')
      .if(employeeContract.employeeContractId > 0, (query) => {
        query.whereNot(
          'employee_contract_id',
          employeeContract.employeeContractId
        )
      })
      .where('employee_contract_folio', employeeContract.employeeContractFolio)
      .first()
    if (existEmployeeContract) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee contract folio already exists',
        message: `The employee contract resource cannot be ${action} because the folio is already assigned`,
        data: { ...employeeContract },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...employeeContract },
    }
  }

  async setHireDateFromFirstContract(employeeContract: EmployeeContract) {
    const firstEmployeeContract = await EmployeeContract.query()
      .whereNull('employee_contract_deleted_at')
      .where('employee_id', employeeContract.employeeId)
      .orderBy('employeeContractStartDate', 'asc')
      .first()
    if (firstEmployeeContract) {
      const employee = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('employee_id', employeeContract.employeeId)
        .first()
      if (employee) {
        const hireDate =
          DateTime.fromISO(firstEmployeeContract.employeeContractStartDate).isValid
            ? DateTime.fromISO(firstEmployeeContract.employeeContractStartDate) // Deja hireDate como DateTime
            : DateTime.fromJSDate(new Date(firstEmployeeContract.employeeContractStartDate))
        employee.employeeHireDate = hireDate
        await employee.save()
      }
    }
  }

  async setDepartmentAndPositionFromLastContract(employeeContract: EmployeeContract) {
    const firstEmployeeContract = await EmployeeContract.query()
      .whereNull('employee_contract_deleted_at')
      .where('employee_id', employeeContract.employeeId)
      .orderBy('employeeContractStartDate', 'desc')
      .first()
    if (firstEmployeeContract) {
      const employee = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('employee_id', employeeContract.employeeId)
        .first()
      if (employee) {
        employee.departmentId = firstEmployeeContract.departmentId
        employee.positionId = firstEmployeeContract.positionId
        await employee.save()
      }
    }
  }
}
