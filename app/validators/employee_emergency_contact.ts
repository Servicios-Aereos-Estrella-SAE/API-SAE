import vine from '@vinejs/vine'

export const createEmployeeEmergencyContactValidator = vine.compile(
  vine.object({
    employeeEmergencyContactFirstname: vine.string().trim().minLength(1).maxLength(150),
    employeeEmergencyContactLastname: vine.string().trim().minLength(0).maxLength(150),
    employeeEmergencyContactSecondLastname: vine.string().trim().minLength(0).maxLength(150),
    employeeEmergencyContactRelationship: vine.string().trim().minLength(1).maxLength(150),
    employeeEmergencyContactPhone: vine.string().trim().minLength(1).maxLength(45),
    employeeId: vine.number(),
  })
)

export const updateEmployeeEmergencyContactValidator = vine.compile(
  vine.object({
    employeeEmergencyContactFirstname: vine.string().trim().minLength(1).maxLength(150),
    employeeEmergencyContactLastname: vine.string().trim().minLength(0).maxLength(150),
    employeeEmergencyContactSecondLastname: vine.string().trim().minLength(0).maxLength(150),
    employeeEmergencyContactRelationship: vine.string().trim().minLength(1).maxLength(150),
    employeeEmergencyContactPhone: vine.string().trim().minLength(1).maxLength(45),
  })
)
