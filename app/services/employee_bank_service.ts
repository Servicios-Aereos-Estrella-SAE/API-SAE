import Employee from '#models/employee'
import EmployeeBank from '#models/employee_bank'
import crypto from 'node:crypto'

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
    newEmployeeBank.employeeBankAccountCurrencyType = employeeBank.employeeBankAccountCurrencyType
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
    currentEmployeeBank.employeeBankAccountCurrencyType =
      employeeBank.employeeBankAccountCurrencyType
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
      .preload('bank')
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

  encrypt(value: string, secretKey: string): string {
    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(16)

    // Create the cipher using AES-256-CTR
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(secretKey, 'utf-8'), iv)

    // Perform the encryption
    let encrypted = cipher.update(value, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    // Return the IV along with the encrypted value so it can be decrypted later
    return `${iv.toString('hex')}:${encrypted}`
  }
}
