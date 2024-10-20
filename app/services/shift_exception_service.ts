import ShiftException from '#models/shift_exception'
import { DateTime } from 'luxon'
import { ShiftExceptionFilterInterface } from '../interfaces/shift_exception_filter_interface.js'

export default class ShiftExceptionService {
  async create(shiftException: ShiftException) {
    const newShiftException = new ShiftException()
    newShiftException.employeeId = shiftException.employeeId
    newShiftException.shiftExceptionsDescription = shiftException.shiftExceptionsDescription
    newShiftException.shiftExceptionsDate = shiftException.shiftExceptionsDate
    newShiftException.exceptionTypeId = shiftException.exceptionTypeId
    newShiftException.vacationSettingId = shiftException.vacationSettingId
    await newShiftException.save()
    return newShiftException
  }

  async update(currentShiftException: ShiftException, shiftException: ShiftException) {
    currentShiftException.employeeId = shiftException.employeeId
    currentShiftException.shiftExceptionsDescription = shiftException.shiftExceptionsDescription
    currentShiftException.shiftExceptionsDate = shiftException.shiftExceptionsDate
    currentShiftException.exceptionTypeId = shiftException.exceptionTypeId
    currentShiftException.vacationSettingId = shiftException.vacationSettingId
    await currentShiftException.save()
    return currentShiftException
  }

  async getByEmployee(filters: ShiftExceptionFilterInterface) {
    const shiftExceptions = await ShiftException.query()
      .whereNull('shift_exceptions_deleted_at')
      .where('employee_id', filters.employeeId)
      .if(filters.exceptionTypeId > 0, (query) => {
        query.where('exception_type_id', filters.exceptionTypeId)
      })
      .if(filters.dateStart && filters.dateEnd, (query) => {
        const stringDate = `${filters.dateStart}T00:00:00.000-06:00`
        const time = DateTime.fromISO(stringDate, { setZone: true })
        const timeCST = time.setZone('America/Mexico_City')
        const filterInitialDate = timeCST.toFormat('yyyy-LL-dd HH:mm:ss')
        const stringEndDate = `${filters.dateEnd}T23:59:59.000-06:00`
        const timeEnd = DateTime.fromISO(stringEndDate, { setZone: true })
        const timeEndCST = timeEnd.setZone('America/Mexico_City')
        const filterEndDate = timeEndCST.toFormat('yyyy-LL-dd HH:mm:ss')
        query.where('shift_exceptions_date', '>=', filterInitialDate)
        query.where('shift_exceptions_date', '<=', filterEndDate)
      })
      .preload('exceptionType')
      .preload('vacationSetting')
      .orderBy('shift_exceptions_date')
    return shiftExceptions
  }

  isValidDate(date: string) {
    try {
      date = date.replaceAll('"', '')
      let dt = DateTime.fromFormat(date, 'yyyy-MM-dd')
      if (dt.isValid) {
        return true
      } else {
        dt = DateTime.fromISO(date)
        if (dt.isValid) {
          return true
        }
      }
    } catch (error) {}
    return false
  }

  getDateAndTime(shiftExceptionsDate: string) {
    // const dateAndTime = shiftExceptionsDate.toString()
    // if (dateAndTime.toString().includes('T')) {
    //   let [date, horaConZona] = dateAndTime.split('T')
    //   const time = horaConZona.replaceAll('"', '').substring(0, 8)
    //   return `${date.replaceAll('"', '')} ${time}`
    // } else {
    //   let [date, horaConZona] = dateAndTime.split(' ')
    //   const time = horaConZona.replaceAll('"', '').substring(0, 8)
    //   return `${date.replaceAll('"', '')} ${time}`
    // }
    return `${shiftExceptionsDate}T00:00:00.000-06:00`
  }

  async verifyInfo(shiftException: ShiftException) {
    const action = shiftException.shiftExceptionId > 0 ? 'updated' : 'created'
    const existDate = await ShiftException.query()
      .if(shiftException.shiftExceptionId > 0, (query) => {
        query.whereNot('shift_exception_id', shiftException.shiftExceptionId)
      })
      .whereNull('shift_exceptions_deleted_at')
      .where('shift_exceptions_date', shiftException.shiftExceptionsDate)
      .where('employee_id', shiftException.employeeId)
      .first()

    if (existDate) {
      return {
        status: 400,
        type: 'warning',
        title: 'The date exists in other exception',
        message: `The shift exception resource cannot be ${action} because the date exists in other exception is already assigned to another shift exception.`,
        data: { ...shiftException },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...shiftException },
    }
  }
}
