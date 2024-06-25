import Employee from '#models/employee'
import Shift from '#models/shift'
import vine from '@vinejs/vine'

export const createEmployeeShiftValidator = vine.compile(
  vine.object({
    employeeId: vine.number().exists(async (_db, value) => {
      const existingEmployee = await Employee.query().where('id', value).first()
      return !!existingEmployee
    }),
    shiftId: vine.number().exists(async (_db, value) => {
      const existingShift = await Shift.query().where('id', value).first()
      return !!existingShift
    }),
  })
)

export const updateEmployeeShiftValidator = vine.compile(
  vine.object({
    employeeId: vine
      .number()
      .exists(async (_db, value) => {
        const existingEmployee = await Employee.query().where('id', value).first()
        return !!existingEmployee
      })
      .optional(),
    shiftId: vine
      .number()
      .exists(async (_db, value) => {
        const existingShift = await Shift.query().where('id', value).first()
        return !!existingShift
      })
      .optional(),
  })
)
