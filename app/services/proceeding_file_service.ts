import ProceedingFile from '#models/proceeding_file'

export default class ProceedingFileService {
  async create(proceedingFile: ProceedingFile) {
    const newProceedingFile = new ProceedingFile()
    newProceedingFile.proceedingFileName = proceedingFile.proceedingFileName
    newProceedingFile.proceedingFilePath = proceedingFile.proceedingFilePath
    newProceedingFile.proceedingFileTypeId = proceedingFile.proceedingFileTypeId
    newProceedingFile.proceedingFileExpirationAt = proceedingFile.proceedingFileExpirationAt
    newProceedingFile.proceedingFileActive = proceedingFile.proceedingFileActive
    await newProceedingFile.save()
    return newProceedingFile
  }
}
