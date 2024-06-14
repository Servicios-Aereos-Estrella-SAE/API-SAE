import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Department from './department.js'
import Position from './position.js'

/**
 * @swagger
 * components:
 *   schemas:
 *      Employee:
 *        type: object
 *        properties:
 *          employeeId:
 *            type: number
 *            description: Employee Id
 *          employeeSyncId:
 *            type: number
 *            description: Imported employee ID
 *          employeeStatus:
 *            type: string
 *            description: Employee status
 *          employeeCode:
 *            type: number
 *            description: Employee code
 *          employeeFirstName:
 *            type: string
 *            description: Employee first name
 *          employeeLastName:
 *            type: string
 *            description: Employee last name
 *          employeeNickname:
 *            type: string
 *            description: Employee nick name
 *          employeePassport:
 *            type: string
 *            description: Employee passport
 *          employeeDriverLicenseAutomobile:
 *            type: string
 *            description: Employee driver license automobile
 *          employeeDriverLicenseMotorcycle:
 *            type: string
 *            description: Employee driver license motorcycle
 *          employeePhoto:
 *            type: string
 *            description: Employee photo
 *          employeeSelfPassword:
 *            type: string
 *            description: Employee self password
 *          employeeDevicePassword:
 *            type: string
 *            description: Employee device password
 *          employeeDevPrivilege:
 *            type: number
 *            description: Employee dev privilege
 *          employeeCardNo:
 *            type: string
 *            description: Employee card number
 *          employeeAccGroup:
 *            type: string
 *            description: Employee acc group
 *          employeeAccTimezone:
 *            type: string
 *            description: Employee acc timezone
 *          employeeGender:
 *            type: string
 *            description: Employee gender
 *          employeeBirthday:
 *            type: date
 *            description: Employee birthday
 *          employeeAddress:
 *            type: string
 *            description: Employee address
 *          employeePostcode:
 *            type: string
 *            description: Employee postcode
 *          employeeOfficeTel:
 *            type: string
 *            description: Employee office tel
 *          employeeContactTel:
 *            type: string
 *            description: Employee contact tel
 *          employeeMobile:
 *            type: string
 *            description: Employee mobile
 *          employeeNationalNum:
 *            type: string
 *            description: Employee national num
 *          employeePayrollNum:
 *            type: string
 *            description: Employee payroll num
 *          employeeInternalNum:
 *            type: string
 *            description: Employee internal num
 *          employeeNational:
 *            type: string
 *            description: Employee national
 *          employeeReligion:
 *            type: string
 *            description: Employee religion
 *          employeeTitle:
 *            type: string
 *            description: Employee title
 *          employeeEnrollSn:
 *            type: string
 *            description: Employee enroll sn
 *          employeeSsn:
 *            type: string
 *            description: Employee ssn
 *          employeeHireDate:
 *            type: date
 *            description: Employee hire date
 *          employeeVerifyMode:
 *            type: number
 *            description: Employee verify mode
 *          employeeCity:
 *            type: string
 *            description: Employee city
 *          employeeIsAdmin:
 *            type: boolean
 *            description: Employee is admin
 *          employeeEmpType:
 *            type: number
 *            description: Employee emp type
 *          employeeEnableAtt:
 *            type: boolean
 *            description: Employee enable att
 *          employeeEnablePayroll:
 *            type: boolean
 *            description: Employee enable pay roll
 *          employeeEnableOvertime:
 *            type: boolean
 *            description: Employee enable overtime
 *          employeeEnableHoliday:
 *            type: boolean
 *            description: Employee enable holiday
 *          employeeDeleted:
 *            type: boolean
 *            description: Employee deleted
 *          employeeReserved:
 *            type: number
 *            description: Employee reserved
 *          employeeDelTag:
 *            type: number
 *            description: Employee del tag
 *          employeeAppStatus:
 *            type: number
 *            description: Employee app status
 *          employeeAppRole:
 *            type: number
 *            description: Employee app role
 *          employeeEmail:
 *            type: string
 *            description: Employee email
 *          employeeLastLogin:
 *            type: date
 *            description: Employee last login
 *          employeeActive:
 *            type: boolean
 *            description: Employe is active
 *          employeeVacationRule:
 *            type: number
 *            description: Employee vacation rule
 *          employeeChangeUser:
 *            type: number
 *            description: Date the user was updated
 *          employeeCreateUser:
 *            type: string
 *            description: Date the user was created
 *          companyId:
 *            type: number
 *            description: Company id
 *          departmentId:
 *            type: number
 *            description: Department id
 *          positionId:
 *            type: number
 *            description: Position id
 *          employeeLastSynchronizationAt:
 *            type: string
 *            description: Last synchronization date
 *          employeeCreatedAt:
 *            type: string
 *          employeeUpdatedAt:
 *            type: string
 *          employeeDeletedAt:
 *            type: string
 *
 */
export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  declare employee_id: number

  @column()
  declare employeeSyncId: number

  @column()
  declare employeeStatus: number

  @column()
  declare employeeCode: number

  @column()
  declare employeeFirstName: string

  @column()
  declare employeeLastName: string

  @column()
  declare employeeNickname: string

  @column()
  declare employeePassport: string

  @column()
  declare employeeDriverLicenseAutomobile: string

  @column()
  declare employeeDriverLicenseMotorcycle: string

  @column()
  declare employeePhoto: string

  @column()
  declare employeeSelfPassword: string

  @column()
  declare employeeDevicePassword: string

  @column()
  declare employeeDevPrivilege: number

  @column()
  declare employeeCardNo: string

  @column()
  declare employeeAccGroup: string

  @column()
  declare employeeAccTimezone: string

  @column()
  declare employeeGender: string

  @column.date()
  declare employeeBirthday: DateTime

  @column()
  declare employeeAddress: string

  @column()
  declare employeePostcode: string

  @column()
  declare employeeOfficeTel: string

  @column()
  declare employeeContactTel: string

  @column()
  declare employeeMobile: string

  @column()
  declare employeeNationalNum: string

  @column()
  declare employeePayrollNum: string

  @column()
  declare employeeInternalNum: string

  @column()
  declare employeeNational: string

  @column()
  declare employeeReligion: string

  @column()
  declare employeeTitle: string

  @column()
  declare employeeEnrollSn: string

  @column()
  declare employeeSsn: string

  @column.date()
  declare employeeHireDate: DateTime

  @column()
  declare employeeVerifyMode: number

  @column()
  declare employeeCity: string

  @column()
  declare employeeIsAdmin: boolean

  @column()
  declare employeeType: number

  @column()
  declare employeeEnableAtt: boolean

  @column()
  declare employeeEnablePayroll: boolean

  @column()
  declare employeeEnableOvertime: boolean

  @column()
  declare employeeEnableHoliday: boolean

  @column()
  declare employeeDeleted: boolean

  @column()
  declare employeeReserved: number

  @column()
  declare employeeDelTag: number

  @column()
  declare employeeAppStatus: number

  @column()
  declare employeeAppRole: number

  @column()
  declare employeeEmail: string

  @column.dateTime()
  declare employeeLastLogin: DateTime

  @column()
  declare employeeActive: boolean

  @column()
  declare employeeVacationRule: number

  @column()
  declare employeeCreateUser: string

  @column()
  declare employeeChangeUser: string

  @column()
  declare companyId: number

  @column()
  declare departmentId: number

  @column()
  declare departmentSyncId: number

  @column()
  declare positionId: number

  @column()
  declare positionSyncId: number

  @column()
  declare employeeLastSynchronizationAt: Date

  @belongsTo(() => Department, {
    foreignKey: 'departmentId',
  })
  declare personnelDepartment: BelongsTo<typeof Department>

  @belongsTo(() => Position, {
    foreignKey: 'positionId',
  })
  declare personnelPosition: BelongsTo<typeof Position>

  @column.dateTime({ autoCreate: true })
  declare employeeCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeUpdatedAt: DateTime

  @column()
  declare employeeDeletedAt: DateTime | null
}
