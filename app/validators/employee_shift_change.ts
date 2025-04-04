import vine from '@vinejs/vine'

export const createEmployeeShiftChangeValidator = vine.compile(
  vine.object({
    employeeIdFrom: vine.number().min(1),
    shiftIdFrom: vine.number().min(1),
    employeeShiftChangeDateFrom: vine.string().minLength(10).trim().maxLength(10),
    employeeShiftChangeDateFromIsRestDay: vine.boolean(),
    employeeIdTo: vine.number().min(1),
    shiftIdTo: vine.number().min(1),
    employeeShiftChangeDateToIsRestDay: vine.boolean(),
    employeeShiftChangeChangeThisShift: vine.boolean(),
    employeeShiftChangeNote: vine.string().optional(),
  })
)
