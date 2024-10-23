import ProceedingFile from '#models/proceeding_file'

interface ProceedingFileTypeEmailExpiredInterface {
  email: string
  employeesProceedingFilesExpired: Array<ProceedingFile>
  pilotsProceedingFilesExpired: Array<ProceedingFile>
  aircraftsProceedingFilesExpired: Array<ProceedingFile>
}
export type { ProceedingFileTypeEmailExpiredInterface }
