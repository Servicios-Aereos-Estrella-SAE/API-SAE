import Employee from '#models/employee'
import EmployeeRecord from '#models/employee_record'
import EmployeeRecordProperty from '#models/employee_record_property'

export default class EmployeeRecordService {
  async create(employeeRecord: EmployeeRecord) {
    const newEmployeeRecord = new EmployeeRecord()
    newEmployeeRecord.employeeRecordPropertyId = employeeRecord.employeeRecordPropertyId
    newEmployeeRecord.employeeId = employeeRecord.employeeId
    newEmployeeRecord.employeeRecordValue = employeeRecord.employeeRecordValue
    newEmployeeRecord.employeeRecordActive = employeeRecord.employeeRecordActive
    await newEmployeeRecord.save()
    return newEmployeeRecord
  }

  async update(currentEmployeeRecord: EmployeeRecord, employeeRecord: EmployeeRecord) {
    currentEmployeeRecord.employeeRecordValue = employeeRecord.employeeRecordValue
    currentEmployeeRecord.employeeRecordActive = employeeRecord.employeeRecordActive
    await currentEmployeeRecord.save()
    return currentEmployeeRecord
  }

  async delete(currentEmployeeRecord: EmployeeRecord) {
    await currentEmployeeRecord.delete()
    return currentEmployeeRecord
  }

  async show(employeeRecordId: number) {
    const employeeRecord = await EmployeeRecord.query()
      .whereNull('employee_record_deleted_at')
      .where('employee_record_id', employeeRecordId)
      .first()
    return employeeRecord ? employeeRecord : null
  }

  async verifyInfoExist(employeeRecord: EmployeeRecord) {
    const existEmployeeRecordProperty = await EmployeeRecordProperty.query()
      .whereNull('employee_record_property_deleted_at')
      .where('employee_record_property_id', employeeRecord.employeeRecordPropertyId)
      .first()

    if (!existEmployeeRecordProperty && employeeRecord.employeeRecordPropertyId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee record property was not found',
        message: 'The employee record property was not found with the entered ID',
        data: { ...employeeRecord },
      }
    }

    const existEmployee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeRecord.employeeId)
      .first()

    if (!existEmployee && employeeRecord.employeeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee was not found',
        message: 'The employee was not found with the entered ID',
        data: { ...employeeRecord },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...employeeRecord },
    }
  }
}
