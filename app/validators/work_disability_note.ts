import vine from '@vinejs/vine'

export const createWorkDisabilityNoteValidator = vine.compile(
  vine.object({
    workDisabilityNoteDescription: vine.string().trim().minLength(1),
    workDisabilityId: vine.number().min(1),
  })
)
export const updateWorkDisabilityNoteValidator = vine.compile(
  vine.object({
    workDisabilityNoteDescription: vine.string().trim().minLength(1),
  })
)
