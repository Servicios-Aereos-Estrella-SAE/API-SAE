import Pilot from '#models/pilot'
import vine from '@vinejs/vine'

export const createPilotValidator = vine.compile(
  vine.object({
    personId: vine
      .number()
      .min(1)
      .unique(async (_db, value) => {
        const existingPersonId = await Pilot.query()
          .where('person_id', value)
          .whereNull('pilot_deleted_at')
          .first()
        return !existingPersonId
      }),
  })
)
