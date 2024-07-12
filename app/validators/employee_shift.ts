/* eslint-disable no-console */
import Employee from '#models/employee'
import Shift from '#models/shift'
import vine from '@vinejs/vine'

export const createEmployeeShiftValidator = vine.compile(
  vine.object({
    employeeId: vine.number().exists(async (_db, value) => {
      const existingEmployee = await Employee.query().where('employeeId', value).first()
      console.log('Employee:', existingEmployee)
      return !!existingEmployee
    }),
    shiftId: vine.number().exists(async (_db, value) => {
      const existingShift = await Shift.query().where('shiftId', value).first()
      console.log('Shift:', existingShift)
      return !!existingShift
    }),
    employeShiftsApplySince: vine.date({
      formats: ['YYYY-MM-DD', 'x'],
    }),
  })
)

export const updateEmployeeShiftValidator = vine.compile(
  vine.object({
    employeeId: vine
      .number()
      .exists(async (_db, value) => {
        const existingEmployee = await Employee.query().where('employeeId', value).first()
        return !!existingEmployee
      })
      .optional(),
    shiftId: vine
      .number()
      .exists(async (_db, value) => {
        const existingShift = await Shift.query().where('shiftId', value).first()
        return !!existingShift
      })
      .optional(),
    employeShiftsApplySince: vine.date({
      formats: ['YYYY-MM-DD', 'x'],
    }),
  })
)
