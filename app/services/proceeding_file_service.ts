import ProceedingFile from '#models/proceeding_file'
import { DateTime } from 'luxon'

export default class ProceedingFileService {
  async create(proceedingFile: ProceedingFile) {
    const newProceedingFile = new ProceedingFile()
    newProceedingFile.proceedingFileName = proceedingFile.proceedingFileName
    newProceedingFile.proceedingFilePath = proceedingFile.proceedingFilePath
    newProceedingFile.proceedingFileTypeId = proceedingFile.proceedingFileTypeId
    newProceedingFile.proceedingFileExpirationAt = proceedingFile.proceedingFileExpirationAt
    newProceedingFile.proceedingFileActive = proceedingFile.proceedingFileActive
    newProceedingFile.proceedingFileIdentify = proceedingFile.proceedingFileIdentify
    newProceedingFile.proceedingFileUuid = proceedingFile.proceedingFileUuid
    await newProceedingFile.save()
    await newProceedingFile.load('proceedingFileType')
    return newProceedingFile
  }

  async update(currentProceedingFile: ProceedingFile, proceedingFile: ProceedingFile) {
    currentProceedingFile.proceedingFileName = proceedingFile.proceedingFileName
    currentProceedingFile.proceedingFilePath = proceedingFile.proceedingFilePath
    currentProceedingFile.proceedingFileTypeId = proceedingFile.proceedingFileTypeId
    currentProceedingFile.proceedingFileExpirationAt = proceedingFile.proceedingFileExpirationAt
    currentProceedingFile.proceedingFileActive = proceedingFile.proceedingFileActive
    currentProceedingFile.proceedingFileIdentify = proceedingFile.proceedingFileIdentify
    currentProceedingFile.proceedingFileUuid = proceedingFile.proceedingFileUuid
    await currentProceedingFile.save()
    return currentProceedingFile
  }

  async delete(currentProceedingFile: ProceedingFile) {
    await currentProceedingFile.delete()
    return currentProceedingFile
  }

  async show(proceedingFileId: number) {
    const proceedingFile = await ProceedingFile.query()
      .whereNull('proceeding_file_deleted_at')
      .where('proceeding_file_id', proceedingFileId)
      .preload('proceedingFileType')
      .first()
    return proceedingFile ? proceedingFile : null
  }

  async verifyInfo(proceedingFile: ProceedingFile) {
    const proceedingFileExpirationAt = proceedingFile.proceedingFileExpirationAt
    if (proceedingFileExpirationAt && !this.isValidDate(proceedingFileExpirationAt)) {
      return {
        status: 400,
        type: 'error',
        title: 'Validation error',
        message: 'Date is invalid',
        data: proceedingFileExpirationAt,
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...proceedingFile },
    }
  }

  private isValidDate(date: string) {
    try {
      date = date.replaceAll('"', '')
      let dt = DateTime.fromISO(date)
      if (dt.isValid) {
        return true
      } else {
        dt = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss')
        if (dt.isValid) {
          return true
        }
      }
    } catch (error) {}
    return false
  }

  formatDate(date: string) {
    const dateOrigin = new Date(date.toString())
    const dateNew = DateTime.fromJSDate(dateOrigin)
    const dateFormated = dateNew.toFormat('yyyy-MM-dd')
    return dateFormated
  }
}
