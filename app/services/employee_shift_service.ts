import EmployeeShift from '#models/employee_shift'
import { DateTime } from 'luxon'
import { EmployeeShiftFilterInterface } from '../interfaces/employee_shift_filter_interface.js'

export default class EmployeeShiftService {
  async verifyInfo(employeeShift: EmployeeShift) {
    const lastShift = await EmployeeShift.query()
      .whereNull('employe_shifts_deleted_at')
      .if(employeeShift.employeeShiftId > 0, (query) => {
        query.whereNot('employee_shift_id', employeeShift.employeeShiftId)
      })
      .where('employee_id', employeeShift.employeeId)
      .orderBy('employe_shifts_apply_since', 'desc')
      .first()
    if (lastShift) {
      const currentDateApplySince = DateTime.fromISO(lastShift.employeShiftsApplySince.toString())
      const newDateApplySince = DateTime.fromISO(employeeShift.employeShiftsApplySince.toString())
      if (
        lastShift.shiftId === employeeShift.shiftId &&
        newDateApplySince >= currentDateApplySince
      ) {
        return {
          status: 400,
          type: 'warning',
          title: 'The shift ID is already exist',
          message: 'Shift cannot be reassigned',
          data: { ...employeeShift },
        }
      }
    }

    const applySince = DateTime.fromFormat(
      employeeShift.employeShiftsApplySince.toString(),
      'yyyy-MM-dd HH:mm:ss'
    ).toFormat('yyyy-MM-dd')
    if (applySince) {
      const sameShift = await EmployeeShift.query()
        .whereNull('employe_shifts_deleted_at')
        .if(employeeShift.employeeShiftId > 0, (query) => {
          query.whereNot('employee_shift_id', employeeShift.employeeShiftId)
        })
        .where('employee_id', employeeShift.employeeId)
        .where('shift_id', employeeShift.shiftId)
        //.where('employe_shifts_apply_since', applySince)
        .whereRaw('DATE(employe_shifts_apply_since) = ?', [applySince])
        .orderBy('shift_id', 'desc')
        .first()
      if (sameShift) {
        return {
          status: 400,
          type: 'warning',
          title: 'The date apply since is already exist',
          message: 'The date apply since cannot be reassigned',
          data: { ...employeeShift },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...employeeShift },
    }
  }

  async getByEmployee(filters: EmployeeShiftFilterInterface) {
    const employeeShifts = await EmployeeShift.query()
      .whereNull('employe_shifts_deleted_at')
      .where('employee_id', filters.employeeId)
      .if(filters.shiftId > 0, (query) => {
        query.where('shift_id', filters.shiftId)
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
        query.where('employe_shifts_apply_since', '>=', filterInitialDate)
        query.where('employe_shifts_apply_since', '<=', filterEndDate)
      })
      .preload('shift')
      .orderBy('employe_shifts_apply_since')
    return employeeShifts
  }

  async getShiftActiveByEmployee(employeeId: number) {
    const today = new Date().toISOString().split('T')[0]
    const employeeShift = await EmployeeShift.query()
      .whereNull('employe_shifts_deleted_at')
      .where('employee_id', employeeId)
      .whereRaw('DATE(employe_shifts_apply_since) <= ?', [today])
      .orderBy('employe_shifts_apply_since', 'desc')
      .preload('shift')
      .first()
    return employeeShift
  }

  isValidDate(date: string) {
    try {
      date = date.replaceAll('"', '')
      let dt = DateTime.fromISO(date)
      if (dt.isValid) {
        return true
      } else {
        dt = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss')
        if (dt.isValid) {
          return true
        }
      }
    } catch (error) {}
    return false
  }

  getDateAndTime(employeShiftsApplySince: string) {
    const dateAndTime = employeShiftsApplySince.toString()
    if (dateAndTime.toString().includes('T')) {
      let [date, horaConZona] = dateAndTime.split('T')
      const time = horaConZona.replaceAll('"', '').substring(0, 8)
      return `${date.replaceAll('"', '')} ${time}`
    } else {
      let [date, horaConZona] = dateAndTime.split(' ')
      const time = horaConZona.replaceAll('"', '').substring(0, 8)
      return `${date.replaceAll('"', '')} ${time}`
    }
  }
}
