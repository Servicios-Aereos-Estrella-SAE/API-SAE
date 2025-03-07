import Employee from '#models/employee'
import EmployeeBank from '#models/employee_bank'

export default class EmployeeBankService {
  async create(employeeBank: EmployeeBank) {
    const newEmployeeBank = new EmployeeBank()
    newEmployeeBank.employeeBankAccountClabe = employeeBank.employeeBankAccountClabe
    newEmployeeBank.employeeBankAccountClabeLastNumbers =
      employeeBank.employeeBankAccountClabeLastNumbers
    newEmployeeBank.employeeBankAccountNumber = employeeBank.employeeBankAccountNumber
    newEmployeeBank.employeeBankAccountNumberLastNumbers =
      employeeBank.employeeBankAccountNumberLastNumbers
    newEmployeeBank.employeeBankAccountType = employeeBank.employeeBankAccountType
    newEmployeeBank.employeeId = employeeBank.employeeId
    newEmployeeBank.bankId = employeeBank.bankId
    await newEmployeeBank.save()
    return newEmployeeBank
  }

  async update(currentEmployeeBank: EmployeeBank, employeeBank: EmployeeBank) {
    currentEmployeeBank.employeeBankAccountClabe = employeeBank.employeeBankAccountClabe
    currentEmployeeBank.employeeBankAccountClabeLastNumbers =
      employeeBank.employeeBankAccountClabeLastNumbers
    currentEmployeeBank.employeeBankAccountNumber = employeeBank.employeeBankAccountNumber
    currentEmployeeBank.employeeBankAccountNumberLastNumbers =
      employeeBank.employeeBankAccountNumberLastNumbers
    currentEmployeeBank.employeeBankAccountType = employeeBank.employeeBankAccountType
    currentEmployeeBank.bankId = employeeBank.bankId
    await currentEmployeeBank.save()
    return currentEmployeeBank
  }

  async delete(currentEmployeeBank: EmployeeBank) {
    await currentEmployeeBank.delete()
    return currentEmployeeBank
  }

  async show(employeeBankId: number) {
    const employeeBank = await EmployeeBank.query()
      .whereNull('employee_bank_deleted_at')
      .where('employee_bank_id', employeeBankId)
      .first()
    return employeeBank ? employeeBank : null
  }

  async verifyInfoExist(employeeBank: EmployeeBank) {
    const existEmployee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeBank.employeeId)
      .first()

    if (!existEmployee && employeeBank.employeeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee was not found',
        message: 'The employee was not found with the entered ID',
        data: { ...employeeBank },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...employeeBank },
    }
  }
}
