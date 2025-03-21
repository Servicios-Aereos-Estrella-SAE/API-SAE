import vine from '@vinejs/vine'

export const createEmployeeEmergencyContactValidator = vine.compile(
  vine.object({
    employeeEmergencyContactFirstname: vine.string().trim().minLength(0).maxLength(150).optional(),
    employeeEmergencyContactLastname: vine.string().trim().minLength(0).maxLength(150).optional(),
    employeeEmergencyContactSecondLastname: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(150)
      .optional(),
    employeeEmergencyContactRelationship: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(150)
      .optional(),
    employeeEmergencyContactPhone: vine.string().trim().minLength(0).maxLength(45).optional(),
    employeeId: vine.number(),
  })
)

export const updateEmployeeEmergencyContactValidator = vine.compile(
  vine.object({
    employeeEmergencyContactFirstname: vine.string().trim().minLength(0).maxLength(150).optional(),
    employeeEmergencyContactLastname: vine.string().trim().minLength(0).maxLength(150).optional(),
    employeeEmergencyContactSecondLastname: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(150)
      .optional(),
    employeeEmergencyContactRelationship: vine
      .string()
      .trim()
      .minLength(0)
      .maxLength(150)
      .optional(),
    employeeEmergencyContactPhone: vine.string().trim().minLength(0).maxLength(45).optional(),
  })
)
