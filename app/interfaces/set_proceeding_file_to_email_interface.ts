import ProceedingFile from '#models/proceeding_file'
import { ProceedingFileTypeEmailExpiredAndExpiringInterface } from './proceeding_file_type_email_expired_and_expiring_interface.js'

interface SetProceedingFileToEmailInterface {
  emails: Array<ProceedingFileTypeEmailExpiredAndExpiringInterface>
  proceedingFile: ProceedingFile
  areaToUse: string
  type: string
}
export type { SetProceedingFileToEmailInterface }
