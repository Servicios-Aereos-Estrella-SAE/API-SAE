import Aircraft from '#models/aircraft'
import ProceedingFile from '#models/proceeding_file'
import AircraftProceedingFile from '#models/aircraft_proceeding_file'
import vine from '@vinejs/vine'

// Validador para crear un AircraftProceedingFile
export const createAircraftProceedingFileValidator = vine.compile(
  vine.object({
    aircraftId: vine.number().exists(async (_db: any, value: any) => {
      const aircraft = await Aircraft.query().where('aircraft_id', value).first()
      return !!aircraft
    }),
    proceedingFileId: vine
      .number()
      .exists(async (_db: any, value: any) => {
        const proceedingFile = await ProceedingFile.find(value)
        return !!proceedingFile
      })
      .unique(async (_db: any, value: any, context: any) => {
        const aircraftId = context.data.aircraftId

        if (!aircraftId) {
          return false
        }

        const existingRelation = await AircraftProceedingFile.query()
          .where('aircraft_id', aircraftId)
          .andWhere('proceeding_file_id', value)
          .first()

        return !existingRelation
      }),
  })
)
export const createAircraftProceedingFileMessages = {
  'aircraftId.exists': 'El ID de la aeronave no existe.',
  'proceedingFileId.exists': 'El ID del archivo de procedimiento no existe.',
  'proceedingFileId.unique': 'Esta relación entre aeronave y archivo ya existe.',
}

export const updateAircraftProceedingFileValidator = vine.compile(
  vine.object({
    aircraftId: vine.number().exists(async (_db: any, value: any) => {
      const aircraft = await Aircraft.find(value)
      return !!aircraft
    }),
    proceedingFileId: vine
      .number()
      .exists(async (_db: any, value: any) => {
        const proceedingFile = await ProceedingFile.find(value)
        return !!proceedingFile
      })
      .unique(async (_db: any, value: any, context: any) => {
        // Acceder al 'aircraftId' desde 'context.data'
        const aircraftId = context.data.aircraftId

        if (!aircraftId) {
          return false
        }

        const existingRelation = await AircraftProceedingFile.query()
          .where('aircraft_id', aircraftId)
          .andWhere('proceeding_file_id', value)
          .first()

        return !existingRelation
      }),
  })
)
export const updateAircraftProceedingFileMessages = {
  'aircraftId.exists': 'El ID de la aeronave no existe.',
  'proceedingFileId.exists': 'El ID del archivo de procedimiento no existe.',
  'proceedingFileId.unique': 'Esta relación entre aeronave y archivo ya existe.',
}
