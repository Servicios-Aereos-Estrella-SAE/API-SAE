import ExceptionType from '#models/exception_type'
import ShiftException from '#models/shift_exception'
import WorkDisability from '#models/work_disability'
import WorkDisabilityPeriod from '#models/work_disability_period'
import WorkDisabilityType from '#models/work_disability_type'
import { DateTime } from 'luxon'
import ShiftExceptionService from './shift_exception_service.js'
import { ShiftExceptionErrorInterface } from '../interfaces/shift_exception_error_interface.js'
import { WorkDisabilityPeriodAddShiftExceptionInterface } from '../interfaces/work_disability_period_add_shift_exception_interface.js'

export default class WorkDisabilityPeriodService {
  async create(workDisabilityPeriod: WorkDisabilityPeriod) {
    const newWorkDisabilityPeriod = new WorkDisabilityPeriod()
    newWorkDisabilityPeriod.workDisabilityPeriodStartDate =
      workDisabilityPeriod.workDisabilityPeriodStartDate
    newWorkDisabilityPeriod.workDisabilityPeriodEndDate =
      workDisabilityPeriod.workDisabilityPeriodEndDate
    newWorkDisabilityPeriod.workDisabilityPeriodTicketFolio =
      workDisabilityPeriod.workDisabilityPeriodTicketFolio
    newWorkDisabilityPeriod.workDisabilityPeriodFile = workDisabilityPeriod.workDisabilityPeriodFile
    newWorkDisabilityPeriod.workDisabilityId = workDisabilityPeriod.workDisabilityId
    newWorkDisabilityPeriod.workDisabilityTypeId = workDisabilityPeriod.workDisabilityTypeId
    await newWorkDisabilityPeriod.save()
    return newWorkDisabilityPeriod
  }

  async show(workDisabilityPeriodId: number) {
    const workDisabilityPeriod = await WorkDisabilityPeriod.query()
      .whereNull('work_disability_period_deleted_at')
      .where('work_disability_period_id', workDisabilityPeriodId)
      .preload('workDisabilityType')
      .first()
    return workDisabilityPeriod ? workDisabilityPeriod : null
  }

  async addShiftExceptions(filters: WorkDisabilityPeriodAddShiftExceptionInterface) {
    const shiftExceptionsSaved = [] as Array<ShiftException>
    const shiftExceptionsError = [] as Array<ShiftExceptionErrorInterface>
    const workDisabilityExceptionType = await ExceptionType.query()
      .whereNull('exception_type_deleted_at')
      .where('exception_type_slug', 'falta-por-incapacidad')
      .first()
    if (workDisabilityExceptionType) {
      await filters.workDisabilityPeriod.load('workDisability')
      await filters.workDisabilityPeriod.load('workDisabilityType')
      let currentDate = DateTime.fromISO(filters.workDisabilityPeriod.workDisabilityPeriodStartDate)
      const endDate = DateTime.fromISO(filters.workDisabilityPeriod.workDisabilityPeriodEndDate)
      for await (const date of this.iterateDates(currentDate, endDate)) {
        const shiftException = {
          employeeId: filters.workDisabilityPeriod.workDisability.employeeId,
          shiftExceptionsDescription: `${filters.workDisabilityPeriod.workDisability.insuranceCoverageType.insuranceCoverageTypeName}, ${filters.workDisabilityPeriod.workDisabilityType.workDisabilityTypeName}`,
          shiftExceptionsDate: date.toISODate(),
          exceptionTypeId: workDisabilityExceptionType.exceptionTypeId,
          vacationSettingId: null,
          shiftExceptionCheckInTime: null,
          shiftExceptionCheckOutTime: null,
          shiftExceptionEnjoymentOfSalary: 1,
          shiftExceptionTimeByTime: null,
        } as ShiftException
        try {
          const shiftExceptionService = new ShiftExceptionService()
          const verifyInfoException = await shiftExceptionService.verifyInfo(shiftException)
          if (verifyInfoException.status !== 200) {
            shiftExceptionsError.push({
              shiftExceptionsDate: date.toISODate(),
              error: verifyInfoException.message,
            })
          } else {
            const newShiftException = await shiftExceptionService.create(shiftException)
            if (newShiftException) {
              const rawHeaders = filters.request.request.rawHeaders
              const userId = filters.auth.user?.userId
              if (userId) {
                const logShiftException = await shiftExceptionService.createActionLog(
                  rawHeaders,
                  'store'
                )
                logShiftException.user_id = userId
                logShiftException.record_current = JSON.parse(JSON.stringify(newShiftException))
                const table = 'log_shift_exceptions'
                await shiftExceptionService.saveActionOnLog(logShiftException, table)
              }
              await newShiftException.load('exceptionType')
              await newShiftException.load('vacationSetting')
              shiftExceptionsSaved.push(newShiftException)
            }
          }
        } catch (error) {
          shiftExceptionsError.push({
            shiftExceptionsDate: date.toISODate(),
            error: error.message,
          })
        }
      }
    }
    return { shiftExceptionsSaved, shiftExceptionsError }
  }

  async verifyInfoExist(workDisabilityPeriod: WorkDisabilityPeriod) {
    const existWorkDisability = await WorkDisability.query()
      .whereNull('work_disability_deleted_at')
      .where('work_disability_id', workDisabilityPeriod.workDisabilityId)
      .first()

    if (!existWorkDisability && workDisabilityPeriod.workDisabilityId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The work disability was not found',
        message: 'The work disability was not found with the entered ID',
        data: { ...workDisabilityPeriod },
      }
    }

    const existWorkDisabilityType = await WorkDisabilityType.query()
      .whereNull('work_disability_type_deleted_at')
      .where('work_disability_type_id', workDisabilityPeriod.workDisabilityTypeId)
      .first()

    if (!existWorkDisabilityType && workDisabilityPeriod.workDisabilityTypeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The work disability type was not found',
        message: 'The work disability type was not found with the entered ID',
        data: { ...workDisabilityPeriod },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...workDisabilityPeriod },
    }
  }

  async verifyInfo(workDisabilityPeriod: WorkDisabilityPeriod) {
    const workDisabilityPeriodStartDate = workDisabilityPeriod.workDisabilityPeriodStartDate
    if (
      workDisabilityPeriodStartDate &&
      !this.isValidDate(workDisabilityPeriodStartDate.toString())
    ) {
      return {
        status: 400,
        type: 'error',
        title: 'Validation error',
        message: 'Date start is invalid',
        data: workDisabilityPeriodStartDate,
      }
    }
    const workDisabilityPeriodEndDate = workDisabilityPeriod.workDisabilityPeriodEndDate
    if (workDisabilityPeriodEndDate && !this.isValidDate(workDisabilityPeriodEndDate.toString())) {
      return {
        status: 400,
        type: 'error',
        title: 'Validation error',
        message: 'Date end is invalid',
        data: workDisabilityPeriodEndDate,
      }
    }
    const workDisability = await WorkDisability.query()
      .whereNull('work_disability_deleted_at')
      .where('work_disability_id', workDisabilityPeriod.workDisabilityId)
      .first()
    if (workDisability) {
      const wortkDisabilities = await WorkDisability.query()
        .whereNull('work_disability_deleted_at')
        .where('employee_id', workDisability.employeeId)
        .orderBy('work_disability_id')
      if (wortkDisabilities.length > 0) {
        const wortkDisabilitiesIds = wortkDisabilities.map((item) => item.workDisabilityId)
        const existWorkDisabilityPeriod = await WorkDisabilityPeriod.query()
          .whereNull('work_disability_period_deleted_at')
          .whereIn('work_disability_id', wortkDisabilitiesIds)
          .andWhere((query) => {
            query
              .whereBetween('work_disability_period_start_date', [
                workDisabilityPeriodStartDate,
                workDisabilityPeriodEndDate,
              ])
              .orWhereBetween('work_disability_period_end_date', [
                workDisabilityPeriodStartDate,
                workDisabilityPeriodEndDate,
              ])
              .orWhere((subQuery) => {
                subQuery
                  .where('work_disability_period_start_date', '<=', workDisabilityPeriodStartDate)
                  .andWhere('work_disability_period_end_date', '>=', workDisabilityPeriodEndDate)
              })
          })
          .preload('workDisability')
          .first()
        if (existWorkDisabilityPeriod) {
          const startDateInput = existWorkDisabilityPeriod.workDisabilityPeriodStartDate
          const startDateFormatted = DateTime.fromISO(startDateInput, { zone: 'utc' }).isValid
            ? DateTime.fromISO(startDateInput, { zone: 'utc' }).setLocale('en').toFormat('DDDD')
            : DateTime.fromJSDate(new Date(startDateInput)).setLocale('en').toFormat('DDDD')

          const endDateInput = existWorkDisabilityPeriod.workDisabilityPeriodEndDate
          const endDateFormatted = DateTime.fromISO(endDateInput, { zone: 'utc' }).isValid
            ? DateTime.fromISO(endDateInput, { zone: 'utc' }).setLocale('en').toFormat('DDDD')
            : DateTime.fromJSDate(new Date(endDateInput)).setLocale('en').toFormat('DDDD')

          const message = `Period is already exist in work disability: '${existWorkDisabilityPeriod.workDisability.workDisabilityUuid}' in range ${startDateFormatted} to ${endDateFormatted}`
          return {
            status: 400,
            type: 'error',
            title: 'Validation error',
            message: message,
            data: workDisabilityPeriodEndDate,
          }
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...workDisabilityPeriod },
    }
  }

  private isValidDate(date: string) {
    try {
      date = date.replaceAll('"', '')
      let dt = DateTime.fromISO(date)
      if (dt.isValid) {
        return true
      } else {
        dt = DateTime.fromFormat(date, 'yyyy-MM-dd')
        if (dt.isValid) {
          return true
        }
      }
    } catch (error) {}
    return false
  }

  async *iterateDates(startDate: DateTime, endDate: DateTime) {
    while (startDate <= endDate) {
      yield startDate
      startDate = startDate.plus({ days: 1 })
    }
  }
}
