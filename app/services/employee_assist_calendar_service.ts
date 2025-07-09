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
    let employee = null
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

    }
   
    let employeeCalendar = await this.fetchData(filters, filterInitialDate, filterEndDate, employee)

    const allDatesInRange: string[] = []
    for (
      let dt = DateTime.fromISO(filters.dateStart);
      dt <= DateTime.fromISO(filters.dateEnd);
      dt = dt.plus({ days: 1 })
    ) {
      allDatesInRange.push(dt.toFormat('yyyy-LL-dd'))
    }

    const datesWithData = new Set(employeeCalendar.map(c => c.day))
    const missingDates = allDatesInRange.filter(date => !datesWithData.has(date))

    if (missingDates.length > 0 && employee) {
      const assistService = new AssistsService()
      for await (const day of missingDates) {
        const date = typeof day === 'string' ? new Date(day) : day
        await assistService.updateAssistCalendar(employee.employeeId, date)
      }

      employeeCalendar = await this.fetchData(filters, filterInitialDate, filterEndDate, employee)
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

  private async fetchData(
    filters: EmployeeAssistCalendarFilterInterface,
    filterInitialDate: string,
    filterEndDate: string,
    employee: any
  ): Promise<AssistDayInterface[]> {
    const query = EmployeeAssistCalendar.query()
  
    if (filters.dateStart && !filters.dateEnd) {
      query.where('day', '>=', filterInitialDate)
    }
  
    if (filters.dateEnd && filters.dateStart) {
      query.where('day', '>=', filterInitialDate)
      query.andWhere('day', '<=', filterEndDate)
    }
  
    if (employee) {
      query.where('employee_id', employee.employeeId)
    }
  
    query
      .preload('dateShift')
      .preload('checkIn')
      .preload('checkOut')
      .preload('checkEatIn')
      .preload('checkEatOut')
      .orderBy('day', 'asc')
  
    const assistService = new AssistsService()
    const holidayService = new HolidayService()
    const shiftExceptionService = new ShiftExceptionService()
    const syncAssistService = new SyncAssistsService()
  
    const employeeAssistCalendar = await query
    const employeeCalendar: AssistDayInterface[] = []
  
    for await (const calendar of employeeAssistCalendar) {
      let assistDay: AssistDayInterface = {
        day: calendar.day,
        assist: JSON.parse(JSON.stringify(calendar)) as any,
      }
  
      assistDay.assist.exceptions = []
  
      const promises: Promise<any>[] = []
  
      if (assistDay.assist.hasExceptions) {
        const filter = {
          employeeId: filters.employeeID,
          exceptionTypeId: 0,
          dateStart: calendar.day,
          dateEnd: calendar.day,
        } as ShiftExceptionFilterInterface
  
        promises.push(
          shiftExceptionService.getByEmployee(filter).then(response => {
            assistDay.assist.exceptions = JSON.parse(JSON.stringify(response))
          })
        )
      }
  
      if (assistDay.assist.isHoliday) {
        promises.push(
          holidayService.index(calendar.day, calendar.day, '', 1, 999999).then(response => {
            if (response.status === 200 && response.holidays && response.holidays?.length > 0) {
              assistDay.assist.holiday = JSON.parse(JSON.stringify(response.holidays[0]))
            }
          })
        )
      }
  
      assistDay.assist.assitFlatList = []
  
      if (assistDay.assist.hasAssitFlatList) {
        const filter = {
          employeeId: filters.employeeID,
          dateStart: calendar.day,
          dateEnd: calendar.day,
        } as AssistFlatFilterInterface
  
        promises.push(
          assistService.getAssistFlatList(filter).then(response => {
            assistDay.assist.assitFlatList = response
          })
        )
      }
  
      await Promise.all(promises)
      assistDay = syncAssistService.verifyCheckOutToday(assistDay)
  
      employeeCalendar.push(assistDay)
    }
  
    // Ordenar el resultado por día
    employeeCalendar.sort((a, b) => {
      return DateTime.fromISO(a.day).toMillis() - DateTime.fromISO(b.day).toMillis()
    })
  
    return employeeCalendar
  }
}
