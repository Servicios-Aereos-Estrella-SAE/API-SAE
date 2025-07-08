import { DateTime } from 'luxon'
import Employee from '#models/employee'
import { EmployeeAssistCalendarFilterInterface } from '../interfaces/employee_assist_calendar_filter_interface.js'
import EmployeeAssistCalendar from '#models/employee_assist_calendar'
import { AssistDayInterface } from '../interfaces/assist_day_interface.js'
import AssistsService from './assist_service.js'
import { AssistFlatFilterInterface } from '../interfaces/assist_flat_filter_interface.js'
import ShiftExceptionService from './shift_exception_service.js'
import { ShiftExceptionFilterInterface } from '../interfaces/shift_exception_filter_interface.js'
import HolidayService from './holiday_service.js'
import SyncAssistsService from './sync_assists_service.js'

export default class EmployeeAssistsCalendarService {
  async index (filters: EmployeeAssistCalendarFilterInterface) {
    const stringDate = `${filters.dateStart}T00:00:00.000-06:00`
    const time = DateTime.fromISO(stringDate, { setZone: true })
    const timeCST = time.setZone('UTC-6')
    const filterInitialDate = timeCST.toFormat('yyyy-LL-dd')
    const stringEndDate = `${filters.dateEnd}T23:59:59.000-06:00`
    const timeEnd = DateTime.fromISO(stringEndDate, { setZone: true })
    const timeEndCST = timeEnd.setZone('UTC-6')//.plus({ days: 1 })
    const filterEndDate = timeEndCST.toFormat('yyyy-LL-dd')
    const query = EmployeeAssistCalendar.query()
    let employee = null
    if (filters.dateStart && !filters.dateEnd) {
      query.where('day', '>=', filterInitialDate)
    }

    if (filters.dateEnd && filters.dateStart) {
      query.where('day', '>=', filterInitialDate)
      query.andWhere('day', '<=', filterEndDate)
    }
    if (filters.employeeID) {
      employee = await Employee.query()
        .where('employee_id', filters.employeeID || 0)
        .withTrashed()
        .first()

      if (!employee) {
        return {
          status: 400,
          type: 'warning',
          title: 'Invalid data',
          message: 'Employee not found',
          data: null,
        }
      }

      query.where('employee_id', employee.employeeId)
    }
    query.preload('dateShift')
    query.preload('checkIn')
    query.preload('checkOut')
    query.preload('checkEatIn')
    query.preload('checkEatOut')
    query.orderBy('day', 'asc')
    

    let employeeCalendar = [] as AssistDayInterface[]
    const employeeAssistCalendar = await query
    const assistService = new AssistsService()
    const holidayService = new HolidayService()
    const shiftExceptionService = new ShiftExceptionService()
    const syncAssistService = new SyncAssistsService()
    for await (const calendar of employeeAssistCalendar) {
      let assistDay = {
        day: calendar.day,
        assist: JSON.parse(JSON.stringify(calendar)) as any,
      } as AssistDayInterface

      assistDay.assist.exceptions = []
      if (assistDay.assist.hasExceptions) {
        const filter = {
          employeeId: filters.employeeID,
          exceptionTypeId: 0,
          dateStart: calendar.day,
          dateEnd: calendar.day,
        } as ShiftExceptionFilterInterface
        const shiftExceptionResponse = await shiftExceptionService.getByEmployee(filter)
        assistDay.assist.exceptions = JSON.parse(JSON.stringify(shiftExceptionResponse))
      }

      if (assistDay.assist.isHoliday) {
        const response = await holidayService.index(
          calendar.day,
          calendar.day,
          '',
          1,
          999999
        )
        if (response.status === 200) {
          if (response.holidays && response.holidays.length > 0) {
            assistDay.assist.holiday = JSON.parse(JSON.stringify(response.holidays[0]))
          }
        }
      }

      assistDay.assist.assitFlatList = []
      if (assistDay.assist.hasAssitFlatList) {
        const filter = {
          employeeId: filters.employeeID,
          dateStart: calendar.day,
          dateEnd: calendar.day,
        } as AssistFlatFilterInterface
        const response = await assistService.getAssistFlatList(filter)
        assistDay.assist.assitFlatList = response
      }
      assistDay = syncAssistService.verifyCheckOutToday(assistDay)
      employeeCalendar.push(assistDay)
    }
    return {
      status: 200,
      type: 'success',
      title: 'Successfully action',
      message: 'Success access data',
      data: {
        employeeCalendar,
      },
    }
  }
}
