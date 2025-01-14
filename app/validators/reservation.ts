import vine from '@vinejs/vine'

export const createReservationValidator = vine.compile(
  vine.object({
    customerId: vine.number().min(1), // Ejemplo simple
    // Otras reglas
    // ...
  })
)
