import { DateTime } from 'luxon'

export default interface BiometricEmployeeInterface {
  id: number
  empCode: number
  firstName: string
  lastName: string
  payrollNum: string
  hireDate: DateTime
  companyId: number
  departmentId: number
  positionId: number
}
