import vine from '@vinejs/vine'

// POST /api/vacation-authorizations
export const authorizeVacationValidator = vine.compile(
  vine.object({
    // signature es un archivo en multipart, se valida via request.file en el controlador.
    // Aquí validamos solamente el arreglo de IDs.
    requests: vine.array(vine.number().min(1)).minLength(1),
    vacationSettingId: vine.number().min(1),
  })
)

// GET /pending y /authorized ?employeeId=number
export const employeeIdQueryValidator = vine.compile(
  vine.object({
    employeeId: vine.number().min(1),
  })
)


