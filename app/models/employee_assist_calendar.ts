import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'

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
 *         checkIn:
 *           type: string
 *           format: date-time
 *           description: "Date check in"
 *         checkInDateTime:
 *           type: string
 *           format: date-time
 *           description: "Date check in format date time"
 *         checkInStatus:
 *           type: string
 *           description: "Check in status"
 *         checkOut:
 *           type: string
 *           format: date-time
 *           description: "Date check out"
 *         checkOutDateTime:
 *           type: string
 *           format: date-time
 *           description: "Date check out format date time"
 *         checkOutStatus:
 *           type: string
 *           description: "Check out status"
 *         checkEatIn:
 *           type: string
 *           format: date-time
 *           description: "Date check eat in"
 *         checkEatOut:
 *           type: string
 *           format: date-time
 *           description: "Date check eat out"
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
  declare employeeId: number | null

  @column()
  declare day: string

  @column()
  declare checkIn: DateTime | null

  @column()
  declare checkInDateTime: DateTime | null

  @column()
  declare checkInStatus: string | null

  @column()
  declare checkOut: DateTime | null

  @column()
  declare checkOutDateTime: DateTime | null

  @column()
  declare checkOutStatus: string | null

  @column()
  declare checkEatIn: DateTime | null

  @column()
  declare checkEatOut: DateTime | null

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
}
