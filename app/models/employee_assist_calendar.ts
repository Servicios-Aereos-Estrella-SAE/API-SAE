import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import Shift from './shift.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Assist from './assist.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     EmployeeAssistCalendar:
 *       type: object
 *       properties:
 *         employeeAssistCalendarId:
 *           type: number
 *           description: "Rmployee assist calendar id"
 *         employeeId:
 *           type: number
 *           description: "Employee id"
 *         day:
 *           type: string
 *           description: "Date"
 *         checkInAssistId:
 *           type: number
 *           description: "Date check in assist id"
 *         checkInDateTime:
 *           type: string
 *           format: date-time
 *           description: "Date check in format date time"
 *         checkInStatus:
 *           type: string
 *           description: "Check in status"
 *         checkOutAssistId:
 *           type: number
 *           description: "Date check out assist id"
 *         checkOutDateTime:
 *           type: string
 *           format: date-time
 *           description: "Date check out format date time"
 *         checkOutStatus:
 *           type: string
 *           description: "Check out status"
 *         checkEatInAssistId:
 *           type: number
 *           description: "Date check eat in assist id"
 *         checkEatOutAssistId:
 *           type: number
 *           description: "Date check eat out assist id"
 *         shiftId:
 *           type: number
 *           description: "Shift id"
 *         shiftIsChange:
 *           type: boolean
 *           description: "Shift is change"
 *         hasExceptions:
 *           type: boolean
 *           description: "Has exceptions"
 *         holidayId:
 *           type: number
 *           description: "Holiday id"
 *         isBirthday:
 *           type: boolean
 *           description: "Is birthday"
 *         isCheckInEatNextDay:
 *           type: boolean
 *           description: "Is check in eat next day"
 *         isCheckOutEatNextDay:
 *           type: boolean
 *           description: "Is check out eat next day"
 *         isCheckOutNextDay:
 *           type: boolean
 *           description: "Is check out next day"
 *         isFutureDay:
 *           type: boolean
 *           description: "Is future day"
 *         isHoliday:
 *           type: boolean
 *           description: "Is holiday"
 *         isRestDay:
 *           type: boolean
 *           description: "Is rest day"
 *         isSundayBonus:
 *           type: boolean
 *           description: "Is sunday bonus"
 *         isVacationDate:
 *           type: boolean
 *           description: "Is vacation date"
 *         isWorkDisabilityDate:
 *           type: boolean
 *           description: "Is work disability date"
 *         shiftCalculateFlag:
 *           type: string
 *           description: "Shift calculate flag"
 *         hasAssitFlatList:
 *           type: boolean
 *           description: "Has assist flat list"
 *         employeeAssistCalendarCreatedAt:
 *           type: string
 *           format: date-time
 *           description: "Date created at"
 *         employeeAssistCalendarUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: "Date updated at"
 *         employeeAssistCalendarDeletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Date deleted at"
 */
export default class EmployeeAssistCalendar extends compose(BaseModel, SoftDeletes) {

  @column({ isPrimary: true })
  declare employeeAssistCalendarId: number

  @column()
  declare employeeId: number

  @column()
  declare day: string

  @column()
  declare checkInAssistId: number | null

  @column()
  declare checkInDateTime: string | DateTime | null

  @column()
  declare checkInStatus: string | null

  @column()
  declare checkOutAssistId: number | null

  @column()
  declare checkOutDateTime: string | DateTime | null

  @column()
  declare checkOutStatus: string | null

  @column()
  declare checkEatInAssistId: number | null

  @column()
  declare checkEatOutAssistId: number | null

  @column()
  declare shiftId: number | null

  @column()
  declare shiftIsChange: boolean

  @column()
  declare hasExceptions: boolean

  @column()
  declare holidayId: number | null

  @column()
  declare isBirthday: boolean

  @column()
  declare isCheckInEatNextDay: boolean

  @column()
  declare isCheckOutEatNextDay: boolean

  @column()
  declare isCheckOutNextDay: boolean

  @column()
  declare isFutureDay: boolean

  @column()
  declare isHoliday: boolean

  @column()
  declare isRestDay: boolean

  @column()
  declare isSundayBonus: boolean

  @column()
  declare isVacationDate: boolean

  @column()
  declare isWorkDisabilityDate: boolean

  @column()
  declare shiftCalculateFlag: string | null

  @column()
  declare hasAssitFlatList: boolean

  @column.dateTime({ autoCreate: true })
  declare employeeAssistCalendarCreatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare employeeAssistCalendarUpdatedAt: DateTime | null

  @column.dateTime({ columnName: 'employee_assist_calendar_deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Shift, {
    foreignKey: 'shiftId',
  })
  declare dateShift: BelongsTo<typeof Shift>

  @belongsTo(() => Assist, {
    foreignKey: 'checkInAssistId',
  })
  declare checkIn: BelongsTo<typeof Assist>

  @belongsTo(() => Assist, {
    foreignKey: 'checkOutAssistId',
  })
  declare checkOut: BelongsTo<typeof Assist>

  @belongsTo(() => Assist, {
    foreignKey: 'checkEatInAssistId',
  })
  declare checkEatIn: BelongsTo<typeof Assist>

  @belongsTo(() => Assist, {
    foreignKey: 'checkEatOutAssistId',
  })
  declare checkEatOut: BelongsTo<typeof Assist>
}
