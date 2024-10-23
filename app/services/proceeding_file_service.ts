import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import ProceedingFile from '#models/proceeding_file'
import { DateTime } from 'luxon'
import { ProceedingFileExpiredFilterInterface } from '../interfaces/proceeding_file_expired_filter_interface.js'
import ProceedingFileTypeEmail from '#models/proceeding_file_type_email'
import ProceedingFileType from '#models/proceeding_file_type'
import { ProceedingFileTypeEmailExpiredInterface } from '../interfaces/proceeding_file_type_email_expired_interface.js'

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
    /* const proceedingFileExpirationAt = proceedingFile.proceedingFileExpirationAt
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
    } */
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...proceedingFile },
    }
  }

  /* private isValidDate(date: string) {
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
  } */

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

  async sendFilesExpiresToEmail(filters: ProceedingFileExpiredFilterInterface) {
    const proceedingFileTypeEmail = await ProceedingFileTypeEmail.query()
      .whereNull('proceeding_file_type_email_deleted_at')
      .orderBy('proceeding_file_type_email_email')
      .distinct('proceeding_file_type_email_email')
      .select('proceeding_file_type_email_email')
    const emails = [] as Array<ProceedingFileTypeEmailExpiredInterface>
    for await (const item of proceedingFileTypeEmail) {
      const newEmail = {
        email: item.proceedingFileTypeEmailEmail,
        employeesProceedingFilesExpired: [],
        pilotsProceedingFilesExpired: [],
        aircraftsProceedingFilesExpired: [],
      } as ProceedingFileTypeEmailExpiredInterface
      emails.push(newEmail)
    }

    const employeesProceedingFilesExpired = await this.getExpiredAndExpiring(filters, 'employees')
    for await (const proceedingFile of employeesProceedingFilesExpired) {
      for await (const email of proceedingFile.proceedingFileType.emails) {
        const existEmail = emails.find((a) => a.email === email.proceedingFileTypeEmailEmail)
        if (existEmail) {
          const existFile = existEmail.employeesProceedingFilesExpired.find(
            (a) => a.proceedingFileId === proceedingFile.proceedingFileId
          )
          if (!existFile) {
            existEmail.employeesProceedingFilesExpired.push(proceedingFile)
          }
        }
      }
    }

    const pilotsProceedingFilesExpired = await this.getExpiredAndExpiring(filters, 'pilots')
    for await (const proceedingFile of pilotsProceedingFilesExpired) {
      for await (const email of proceedingFile.proceedingFileType.emails) {
        const existEmail = emails.find((a) => a.email === email.proceedingFileTypeEmailEmail)
        if (existEmail) {
          const existFile = existEmail.pilotsProceedingFilesExpired.find(
            (a) => a.proceedingFileId === proceedingFile.proceedingFileId
          )
          if (!existFile) {
            existEmail.pilotsProceedingFilesExpired.push(proceedingFile)
          }
        }
      }
    }

    const aircraftProceedingFilesExpired = await this.getExpiredAndExpiring(filters, 'aircraft')
    for await (const proceedingFile of aircraftProceedingFilesExpired) {
      for await (const email of proceedingFile.proceedingFileType.emails) {
        const existEmail = emails.find((a) => a.email === email.proceedingFileTypeEmailEmail)
        if (existEmail) {
          const existFile = existEmail.aircraftsProceedingFilesExpired.find(
            (a) => a.proceedingFileId === proceedingFile.proceedingFileId
          )
          if (!existFile) {
            existEmail.aircraftsProceedingFilesExpired.push(proceedingFile)
          }
        }
      }
    }

    const userEmail = env.get('SMTP_USERNAME')
    if (userEmail) {
      for await (const email of emails) {
        if (
          email.employeesProceedingFilesExpired.length > 0 ||
          email.pilotsProceedingFilesExpired.length > 0 ||
          email.aircraftsProceedingFilesExpired.length > 0
        ) {
          await mail.send((message) => {
            message
              .to(email.email)
              .from(userEmail, 'SAE')
              .subject('Expiring and Expired Proceeding Files Report')
              .htmlView('emails/proceeding_files_report', {
                expiredFiles: email.aircraftsProceedingFilesExpired.length || [],
                expiredFilesEmployee: email.employeesProceedingFilesExpired || [],
                expiredFilesPilots: email.pilotsProceedingFilesExpired.length || [],
              })
          })
        }
      }
    }
    return emails
  }

  async getExpiredAndExpiring(filters: ProceedingFileExpiredFilterInterface, areaToUse: string) {
    const proceedingFileTypes = await ProceedingFileType.query()
      .whereNull('proceeding_file_type_deleted_at')
      .where('proceeding_file_type_area_to_use', areaToUse)
      .orderBy('proceeding_file_type_id')
      .select('proceeding_file_type_id')

    const proceedingFileTypesIds = proceedingFileTypes.map((item) => item.proceedingFileTypeId)
    const proceedingFilesExpired = await ProceedingFile.query()
      .whereNull('proceeding_file_deleted_at')
      .whereIn('proceeding_file_type_id', proceedingFileTypesIds)
      .whereBetween('proceeding_file_expiration_at', [filters.dateStart, filters.dateEnd])
      .preload('proceedingFileType', (query) => {
        query.preload('emails')
      })
      .orderBy('proceeding_file_expiration_at')

    return proceedingFilesExpired
  }
}
