import CustomerProceedingFile from '#models/customer_proceeding_file'
import Employee from '#models/employee'
import EmployeeProceedingFile from '#models/employee_proceeding_file'
import FlightAttendantProceedingFile from '#models/flight_attendant_proceeding_file'
import PilotProceedingFile from '#models/pilot_proceeding_file'
import ProceedingFile from '#models/proceeding_file'
import ProceedingFileType from '#models/proceeding_file_type'
import { DateTime } from 'luxon'
import { EmployeeProceedingFileFilterInterface } from '../interfaces/employee_proceeding_file_filter_interface.js'

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
    const existPilotProceedingFile = await PilotProceedingFile.query()
      .whereNull('pilot_proceeding_file_deleted_at')
      .where('proceeding_file_id', employeeProceedingFile.proceedingFileId)
      .first()
    if (existPilotProceedingFile) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file was assigned in pilot proceeding files',
        message: `The relation employee-proceedingfile resource cannot be ${action} because the proceeding file id was assigned in pilot proceeding files`,
        data: { ...employeeProceedingFile },
      }
    }
    const existFlightAttendantProceedingFile = await FlightAttendantProceedingFile.query()
      .whereNull('flight_attendant_proceeding_file_deleted_at')
      .where('proceeding_file_id', employeeProceedingFile.proceedingFileId)
      .first()
    if (existFlightAttendantProceedingFile) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file was assigned in flight attendant proceeding files',
        message: `The relation employee-proceedingfile resource cannot be ${action} because the proceeding file id was assigned in flight attendant proceeding files`,
        data: { ...employeeProceedingFile },
      }
    }
    const existCustomerProceedingFile = await CustomerProceedingFile.query()
      .whereNull('customer_proceeding_file_deleted_at')
      .where('proceeding_file_id', employeeProceedingFile.proceedingFileId)
      .first()
    if (existCustomerProceedingFile) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file was assigned in customer proceeding files',
        message: `The relation employee-proceedingfile resource cannot be ${action} because the proceeding file id was assigned in customer proceeding files`,
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

  async getExpiredAndExpiring(filters: EmployeeProceedingFileFilterInterface) {
    const proceedingFileTypes = await ProceedingFileType.query()
      .whereNull('proceeding_file_type_deleted_at')
      .where('proceeding_file_type_area_to_use', 'employee')
      .orderBy('proceeding_file_type_id')
      .select('proceeding_file_type_id')

    const proceedingFileTypesIds = proceedingFileTypes.map((item) => item.proceedingFileTypeId)
    const proceedingFilesExpired = await ProceedingFile.query()
      .whereNull('proceeding_file_deleted_at')
      .whereIn('proceeding_file_type_id', proceedingFileTypesIds)
      .whereBetween('proceeding_file_expiration_at', [filters.dateStart, filters.dateEnd])
      .preload('proceedingFileType')
      .preload('employeeProceedingFile')
      .orderBy('proceeding_file_expiration_at')
    const newDateStart = DateTime.fromISO(filters.dateEnd).plus({ days: 1 }).toFormat('yyyy-MM-dd')
    const newDateEnd = DateTime.fromISO(filters.dateEnd).plus({ days: 30 }).toFormat('yyyy-MM-dd')
    const proceedingFilesExpiring = await ProceedingFile.query()
      .whereNull('proceeding_file_deleted_at')
      .whereIn('proceeding_file_type_id', proceedingFileTypesIds)
      .whereBetween('proceeding_file_expiration_at', [newDateStart, newDateEnd])
      .preload('proceedingFileType')
      .preload('employeeProceedingFile')
      .orderBy('proceeding_file_expiration_at')

    return {
      proceedingFilesExpired: proceedingFilesExpired ? proceedingFilesExpired : [],
      proceedingFilesExpiring: proceedingFilesExpiring ? proceedingFilesExpiring : [],
    }
  }
}
