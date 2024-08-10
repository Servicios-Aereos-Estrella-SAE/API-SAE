import Employee from '#models/employee'
import EmployeeProceedingFile from '#models/employee_proceeding_file'
import ProceedingFile from '#models/proceeding_file'

export default class EmployeeProceedingFileService {
  async create(employeeProceedingFile: EmployeeProceedingFile) {
    const newEmployeeProceedingFile = new EmployeeProceedingFile()
    newEmployeeProceedingFile.employeeId = employeeProceedingFile.employeeId
    newEmployeeProceedingFile.proceedingFileId = employeeProceedingFile.proceedingFileId
    await newEmployeeProceedingFile.save()
    return newEmployeeProceedingFile
  }

  async update(
    currentEmployeeProceedingFile: EmployeeProceedingFile,
    employeeProceedingFile: EmployeeProceedingFile
  ) {
    currentEmployeeProceedingFile.employeeId = employeeProceedingFile.employeeId
    currentEmployeeProceedingFile.proceedingFileId = employeeProceedingFile.proceedingFileId
    await currentEmployeeProceedingFile.save()
    return currentEmployeeProceedingFile
  }

  async delete(currentEmployeeProceedingFile: EmployeeProceedingFile) {
    await currentEmployeeProceedingFile.delete()
    return currentEmployeeProceedingFile
  }

  async show(employeeProceedingFileId: number) {
    const employeeProceedingFile = await EmployeeProceedingFile.query()
      .whereNull('employee_proceeding_file_deleted_at')
      .where('employee_proceeding_file_id', employeeProceedingFileId)
      .preload('proceedingFile', async (query) => {
        await query.preload('proceedingFileType')
      })
      .first()
    return employeeProceedingFile ? employeeProceedingFile : null
  }

  async index() {
    const employeeProceedingFile = await EmployeeProceedingFile.query()
      .whereNull('employee_proceeding_file_deleted_at')
      .first()
    return employeeProceedingFile ? employeeProceedingFile : null
  }

  async verifyInfoExist(employeeProceedingFile: EmployeeProceedingFile) {
    const existEmployee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeProceedingFile.employeeId)
      .first()

    if (!existEmployee && employeeProceedingFile.employeeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee was not found',
        message: 'The employee was not found with the entered ID',
        data: { ...employeeProceedingFile },
      }
    }

    const existProceedingFile = await ProceedingFile.query()
      .whereNull('proceeding_file_deleted_at')
      .where('proceeding_file_id', employeeProceedingFile.proceedingFileId)
      .first()

    if (!existProceedingFile && employeeProceedingFile.proceedingFileId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file was not found',
        message: 'The proceeding file was not found with the entered ID',
        data: { ...employeeProceedingFile },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...employeeProceedingFile },
    }
  }

  async verifyInfo(employeeProceedingFile: EmployeeProceedingFile) {
    const action = employeeProceedingFile.employeeProceedingFileId > 0 ? 'updated' : 'created'
    const existEmployeeProceedingFile = await EmployeeProceedingFile.query()
      .whereNull('employee_proceeding_file_deleted_at')
      .if(employeeProceedingFile.employeeProceedingFileId > 0, (query) => {
        query.whereNot(
          'employee_proceeding_file_id',
          employeeProceedingFile.employeeProceedingFileId
        )
      })
      .where('employee_id', employeeProceedingFile.employeeId)
      .where('proceeding_file_id', employeeProceedingFile.proceedingFileId)
      .first()
    if (existEmployeeProceedingFile) {
      return {
        status: 400,
        type: 'warning',
        title: 'The relation employee-proceedingfile already exists',
        message: `The relation employee-proceedingfile resource cannot be ${action} because the relation is already assigned`,
        data: { ...employeeProceedingFile },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...employeeProceedingFile },
    }
  }
}
