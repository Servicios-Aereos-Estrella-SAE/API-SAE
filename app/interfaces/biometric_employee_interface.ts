import { DateTime } from 'luxon'

export default interface BiometricEmployeeInterface {
  id: number
  status: number
  empCode: number
  firstName: string
  lastName: string
  nickname: string
  passport: string
  driverLicenseAutomobile: string
  driverLicenseMotorcycle: string
  photo: string
  selfPassword: string
  devicePassword: string
  devPrivilege: number
  cardNo: string
  accGroup: string
  accTimezone: string
  gender: string
  birthday: DateTime
  address: string
  postcode: string
  officeTel: string
  contactTel: string
  mobile: string
  nationalNum: string
  payrollNum: string
  internalEmpNum: string
  national: string
  religion: string
  title: string
  enrollSn: string
  ssn: string
  hireDate: DateTime
  verifyMode: number
  city: string
  isAdmin: boolean
  empType: number
  enableAtt: boolean
  enablePayroll: boolean
  enableOvertime: boolean
  enableHoliday: boolean
  deleted: boolean
  reserved: number
  delTag: number
  appStatus: number
  appRole: number
  email: string
  lastLogin: DateTime
  isActive: boolean
  vacationRule: number
  companyId: number
  departmentId: number
  positionId: number
  createUser: string
  changeUser: string
}
