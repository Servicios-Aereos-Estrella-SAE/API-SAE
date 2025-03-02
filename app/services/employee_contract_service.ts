/* eslint-disable prettier/prettier */
import EmployeeContract from '#models/employee_contract'
import EmployeeContractType from '#models/employee_contract_type'
import Employee from '#models/employee'

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
    await newEmployeeContract.save()
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
    await currentEmployeeContract.save()
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
}
