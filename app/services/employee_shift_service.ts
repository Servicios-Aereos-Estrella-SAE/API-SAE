import EmployeeShift from '#models/employee_shift'
import { DateTime } from 'luxon'

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
    const applySince = DateTime.fromISO(employeeShift.employeShiftsApplySince.toString()).toISO()
    if (applySince) {
      const sameShift = await EmployeeShift.query()
        .whereNull('employe_shifts_deleted_at')
        .if(employeeShift.employeeShiftId > 0, (query) => {
          query.whereNot('employee_shift_id', employeeShift.employeeShiftId)
        })
        .where('employee_id', employeeShift.employeeId)
        .where('shift_id', employeeShift.shiftId)
        .where('employe_shifts_apply_since', applySince)
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
}
