import { DateTime } from 'luxon'
import Employee from '#models/employee'
import { EmployeeAssistCalendarFilterInterface } from '../interfaces/employee_assist_calendar_filter_interface.js'
import EmployeeAssistCalendar from '#models/employee_assist_calendar'

export default class EmployeeAssistsCalendarService {
  async index (filters: EmployeeAssistCalendarFilterInterface) {
    const stringDate = `${filters.dateStart}T00:00:00.000-06:00`
    const time = DateTime.fromISO(stringDate, { setZone: true })
    const timeCST = time.setZone('UTC-6')
    const filterInitialDate = timeCST.toFormat('yyyy-LL-dd')
    const stringEndDate = `${filters.dateEnd}T23:59:59.000-06:00`
    const timeEnd = DateTime.fromISO(stringEndDate, { setZone: true })
    const timeEndCST = timeEnd.setZone('UTC-6').plus({ days: 1 })
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
    const employeeCalendar = await query
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
