import Employee from '#models/employee'
import vine from '@vinejs/vine'

export const createEmployeeValidator = vine.compile(
  vine.object({
    employeeSyncId: vine.string().trim().minLength(0).maxLength(50).optional(),
    employeeCode: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(200)
      .unique(async (_db, value) => {
        const existingCode = await Employee.query()
          .where('employee_code', value)
          .whereNull('employee_deleted_at')
          .first()
        return !existingCode
      }),
    employeeFirstName: vine.string().trim().minLength(0).maxLength(25).optional(),
    employeeLastName: vine.string().trim().minLength(0).maxLength(25).optional(),
    // employeePayrollNum: vine.string().trim().minLength(1).maxLength(50),
    // employeeHireDate: vine.date({
    //   formats: ['YYYY-MM-DD', 'x'],
    // }),
    companyId: vine.number().min(1),
    departmentId: vine.number().min(1),
    departmentSyncId: vine.number().min(0).optional(),
    positionId: vine.number().min(1),
    positionSyncId: vine.number().min(0).optional(),
    employeeWorkSchedule: vine.string().in(['Onsite', 'Remote']),
    personId: vine
      .number()
      .min(1)
      .unique(async (_db, value) => {
        const existingPersonId = await Employee.query()
          .where('person_id', value)
          .whereNull('employee_deleted_at')
          .first()
        return !existingPersonId
      }),
  })
)

export const updateEmployeeValidator = vine.compile(
  vine.object({
    employeeSyncId: vine.string().trim().minLength(0).maxLength(50).optional(),
    employeeCode: vine.string().trim().minLength(1).maxLength(200),
    employeeFirstName: vine.string().trim().minLength(0).maxLength(25).optional(),
    employeeLastName: vine.string().trim().minLength(0).maxLength(25).optional(),
    // employeePayrollNum: vine.string().trim().minLength(1).maxLength(50),
    employeeHireDate: vine.date({
      formats: ['YYYY-MM-DD', 'x'],
    }),
    companyId: vine.number().min(1),
    departmentId: vine.number().min(1),
    departmentSyncId: vine.number().min(0).optional(),
    positionId: vine.number().min(1),
    positionSyncId: vine.number().min(0).optional(),
  })
)
