/* eslint-disable prettier/prettier */
import Employee from '#models/employee'
import { DateTime } from 'luxon'
import EmployeeShiftChange from '#models/employee_shift_changes'
import Shift from '#models/shift'
import { EmployeeShiftChangeFilterInterface } from '../interfaces/employee_shift_change_filter_interface.js'

export default class EmployeeShiftChangeService {
  async create(employeeShiftChange: EmployeeShiftChange) {
    const newEmployeeShiftChange = new EmployeeShiftChange()
    newEmployeeShiftChange.employeeIdFrom = employeeShiftChange.employeeIdFrom
    newEmployeeShiftChange.shiftIdFrom = employeeShiftChange.shiftIdFrom
    newEmployeeShiftChange.employeeShiftChangeDateFrom = employeeShiftChange.employeeShiftChangeDateFrom
    newEmployeeShiftChange.employeeShiftChangeDateFromIsRestDay = employeeShiftChange.employeeShiftChangeDateFromIsRestDay
    newEmployeeShiftChange.employeeIdTo = employeeShiftChange.employeeIdTo
    newEmployeeShiftChange.shiftIdTo = employeeShiftChange.shiftIdTo
    newEmployeeShiftChange.employeeShiftChangeDateTo = employeeShiftChange.employeeShiftChangeDateTo
    newEmployeeShiftChange.employeeShiftChangeDateToIsRestDay = employeeShiftChange.employeeShiftChangeDateToIsRestDay
    await newEmployeeShiftChange.save()
    return newEmployeeShiftChange
  }

  async delete(currentEmployeeShiftChange: EmployeeShiftChange) {
    await currentEmployeeShiftChange.delete()
    return currentEmployeeShiftChange
  }

  async show(employeeShiftChangeId: number) {
    const employeeShiftChange = await EmployeeShiftChange.query()
      .whereNull('employee_shift_change_deleted_at')
      .where('employee_shift_change_id', employeeShiftChangeId)
      .first()
    return employeeShiftChange ? employeeShiftChange : null
  }

  async verifyInfoExist(employeeShiftChange: EmployeeShiftChange) {
   
    const existEmployeeFrom = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeShiftChange.employeeIdFrom)
      .first()

    if (!existEmployeeFrom && employeeShiftChange.employeeIdFrom) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee from was not found',
        message: 'The employee from was not found with the entered ID',
        data: { ...employeeShiftChange },
      }
    }
    const existShiftFrom = await Shift.query()
      .whereNull('shift_deleted_at')
      .where('shift_id', employeeShiftChange.shiftIdFrom)
      .first()

    if (!existShiftFrom && employeeShiftChange.shiftIdFrom) {
      return {
        status: 400,
        type: 'warning',
        title: 'The shift from was not found',
        message: 'The shift from was not found with the entered ID',
        data: { ...employeeShiftChange },
      }
    }

    const existEmployeeTo = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeShiftChange.employeeIdTo)
      .first()

    if (!existEmployeeTo && employeeShiftChange.employeeIdTo) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee to was not found',
        message: 'The employee to was not found with the entered ID',
        data: { ...employeeShiftChange },
      }
    }
    const existShiftTo = await Shift.query()
      .whereNull('shift_deleted_at')
      .where('shift_id', employeeShiftChange.shiftIdTo)
      .first()

    if (!existShiftTo && employeeShiftChange.shiftIdTo) {
      return {
        status: 400,
        type: 'warning',
        title: 'The shift to was not found',
        message: 'The shift to was not found with the entered ID',
        data: { ...employeeShiftChange },
      }
    }
   
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...employeeShiftChange },
    }
  }

  async getByEmployee(filters: EmployeeShiftChangeFilterInterface) {
    const employeeShiftChanges = await EmployeeShiftChange.query()
      .whereNull('employee_shift_change_deleted_at')
      .where('employee_id_from', filters.employeeId)
      .if(filters.date, (query) => {
        const stringDate = `${filters.date}T00:00:00.000-06:00`
        const time = DateTime.fromISO(stringDate, { setZone: true })
        const timeCST = time.setZone('America/Mexico_City')
        const filterInitialDate = timeCST.toFormat('yyyy-LL-dd HH:mm:ss')
        query.where('employe_shifts_apply_since', '>=', filterInitialDate)
        query.where('employe_shifts_apply_since', '<=', filterInitialDate)
      })
      .orderBy('employee_shift_change_date_from')
    return employeeShiftChanges
  }

  async verifyInfo(employeeShiftChange: EmployeeShiftChange) {
    const action = employeeShiftChange.employeeShiftChangeId > 0 ? 'updated' : 'created'
    const employeeShiftChangeDateFrom = DateTime.fromJSDate(new Date(employeeShiftChange.employeeShiftChangeDateFrom)).toFormat('yyyy-MM-dd')
    const existEmployeeShiftChangeDateFrom = await EmployeeShiftChange.query()
      .whereNull('employee_shift_change_deleted_at')
      .if(employeeShiftChange.employeeShiftChangeId > 0, (query) => {
        query.whereNot(
          'employee_shift_change_id',
          employeeShiftChange.employeeShiftChangeId
        )
      })
      .where('employee_id_from', employeeShiftChange.employeeIdFrom)
      .whereBetween('employee_shift_change_date_from', [employeeShiftChangeDateFrom, employeeShiftChangeDateFrom])
      .first()
    if (existEmployeeShiftChangeDateFrom) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee shift change date from already exists',
        message: `The employee shift change resource cannot be ${action} because the date from is already assigned`,
        data: { ...employeeShiftChange },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...employeeShiftChange },
    }
  }
}
