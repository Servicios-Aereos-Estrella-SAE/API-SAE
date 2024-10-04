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
    newProceedingFile.proceedingFileObservations = proceedingFile.proceedingFileObservations
    newProceedingFile.proceedingFileAfacRights = proceedingFile.proceedingFileAfacRights
    newProceedingFile.proceedingFileSignatureDate = proceedingFile.proceedingFileSignatureDate
    newProceedingFile.proceedingFileEffectiveStartDate =
      proceedingFile.proceedingFileEffectiveStartDate
    newProceedingFile.proceedingFileEffectiveEndDate = proceedingFile.proceedingFileEffectiveEndDate
    newProceedingFile.proceedingFileInclusionInTheFilesDate =
      proceedingFile.proceedingFileInclusionInTheFilesDate
    newProceedingFile.proceedingFileOperationCost = proceedingFile.proceedingFileOperationCost
    newProceedingFile.proceedingFileCompleteProcess = proceedingFile.proceedingFileCompleteProcess
    await newProceedingFile.save()

    await newProceedingFile.load('proceedingFileType')
    await newProceedingFile.load('proceedingFileStatus')
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
    currentProceedingFile.proceedingFileObservations = proceedingFile.proceedingFileObservations
    currentProceedingFile.proceedingFileAfacRights = proceedingFile.proceedingFileAfacRights
    currentProceedingFile.proceedingFileSignatureDate = proceedingFile.proceedingFileSignatureDate
    currentProceedingFile.proceedingFileEffectiveStartDate =
      proceedingFile.proceedingFileEffectiveStartDate
    currentProceedingFile.proceedingFileEffectiveEndDate =
      proceedingFile.proceedingFileEffectiveEndDate
    currentProceedingFile.proceedingFileInclusionInTheFilesDate =
      proceedingFile.proceedingFileInclusionInTheFilesDate
    currentProceedingFile.proceedingFileOperationCost = proceedingFile.proceedingFileOperationCost
    currentProceedingFile.proceedingFileCompleteProcess =
      proceedingFile.proceedingFileCompleteProcess
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
      .preload('proceedingFileStatus')
      .first()
    return proceedingFile ? proceedingFile : null
  }

  async verifyInfo(proceedingFile: ProceedingFile) {
    const proceedingFileExpirationAt = proceedingFile.proceedingFileExpirationAt
    const proceedingFileSignatureDate = proceedingFile.proceedingFileSignatureDate
    const proceedingFileEffectiveStartDate = proceedingFile.proceedingFileEffectiveStartDate
    const proceedingFileEffectiveEndDate = proceedingFile.proceedingFileEffectiveEndDate
    const proceedingFileInclusionInTheFilesDate =
      proceedingFile.proceedingFileInclusionInTheFilesDate
    if (proceedingFileExpirationAt && !this.isValidDate(proceedingFileExpirationAt.toString())) {
      return {
        status: 400,
        type: 'error',
        title: 'Validation error',
        message: 'Date expiration at is invalid',
        data: proceedingFileExpirationAt,
      }
    }
    if (proceedingFileSignatureDate && !this.isValidDate(proceedingFileSignatureDate.toString())) {
      return {
        status: 400,
        type: 'error',
        title: 'Validation error',
        message: 'Date signature is invalid',
        data: proceedingFileSignatureDate,
      }
    }
    if (
      proceedingFileEffectiveStartDate &&
      !this.isValidDate(proceedingFileEffectiveStartDate.toString())
    ) {
      return {
        status: 400,
        type: 'error',
        title: 'Validation error',
        message: 'Date effective start is invalid',
        data: proceedingFileEffectiveStartDate,
      }
    }
    if (
      proceedingFileEffectiveEndDate &&
      !this.isValidDate(proceedingFileEffectiveEndDate.toString())
    ) {
      return {
        status: 400,
        type: 'error',
        title: 'Validation error',
        message: 'Date effective end is invalid',
        data: proceedingFileEffectiveEndDate,
      }
    }
    if (
      proceedingFileInclusionInTheFilesDate &&
      !this.isValidDate(proceedingFileInclusionInTheFilesDate.toString())
    ) {
      return {
        status: 400,
        type: 'error',
        title: 'Validation error',
        message: 'Date inclusion in the files is invalid',
        data: proceedingFileInclusionInTheFilesDate,
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
    //aqui zona horaria cambiar
    return dateFormated
  }

  sanitizeInput(input: { [key: string]: string | null }) {
    for (let key in input) {
      if (input[key] === 'null' || input[key] === 'undefined') {
        input[key] = null
      }
    }
    return input
  }
}
