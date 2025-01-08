import WorkDisability from '#models/work_disability'
import WorkDisabilityPeriod from '#models/work_disability_period'
import WorkDisabilityType from '#models/work_disability_type'
import { DateTime } from 'luxon'

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
}
