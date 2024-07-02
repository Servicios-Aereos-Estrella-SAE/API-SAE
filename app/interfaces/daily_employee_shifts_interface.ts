import { EmployeeShiftInterface } from './employee_shift_interface.js'

interface DailyEmployeeShiftsInterface {
  employeeId: number | null
  employeeSyncId: string
  employeeCode: string
  employeeFirstName: string
  employeeLastName: string
  employeePayrollNum: string | null
  employeeHireDate: Date | string | null
  companyId: number
  departmentId: number
  positionId: number
  departmentSyncId: string
  positionSyncId: string
  personId: number
  employeeLastSynchronizationAt: Date | string | null
  employeeCreatedAt: Date | string | null
  employeeUpdatedAt: Date | string | null
  employeeDeletedAt: Date | string | null
  employeeShifts: EmployeeShiftInterface[]
}

export type { DailyEmployeeShiftsInterface }
