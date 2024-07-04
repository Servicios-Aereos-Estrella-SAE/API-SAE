import { ShiftRecordInterface } from './shift_record_interface.js'

interface EmployeeRecordInterface {
  employeeId: number
  employeeSyncId: number
  employeeCode: any
  employeeFirstName: any
  employeeLastName: any
  employeePayrollNum: any
  employeeHireDate: any
  companyId: any
  departmentId: any
  positionId: any
  departmentSyncId: any
  positionSyncId: any
  employeeLastSynchronizationAt: any
  employeeCreatedAt: any
  employeeUpdatedAt: any
  employeeShifts: ShiftRecordInterface[]
}

export type { EmployeeRecordInterface }
