import ProceedingFile from '#models/proceeding_file'

interface ProceedingFileTypeEmailExpiredAndExpiringInterface {
  email: string
  employeesProceedingFilesExpired: Array<ProceedingFile>
  employeesProceedingFilesExpiring: Array<ProceedingFile>
  pilotsProceedingFilesExpired: Array<ProceedingFile>
  pilotsProceedingFilesExpiring: Array<ProceedingFile>
  aircraftsProceedingFilesExpired: Array<ProceedingFile>
  aircraftsProceedingFilesExpiring: Array<ProceedingFile>
  customersProceedingFilesExpired: Array<ProceedingFile>
  customersProceedingFilesExpiring: Array<ProceedingFile>
  flightAttendantsProceedingFilesExpired: Array<ProceedingFile>
  flightAttendantsProceedingFilesExpiring: Array<ProceedingFile>
}
export type { ProceedingFileTypeEmailExpiredAndExpiringInterface }
