import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import ProceedingFile from '#models/proceeding_file'
import { DateTime } from 'luxon'
import { ProceedingFileExpiredFilterInterface } from '../interfaces/proceeding_file_expired_filter_interface.js'
import ProceedingFileTypeEmail from '#models/proceeding_file_type_email'
import ProceedingFileType from '#models/proceeding_file_type'
import ProceedingFileTypeService from './proceeding_file_type_service.js'
import { ProceedingFileTypeEmailExpiredAndExpiringInterface } from '../interfaces/proceeding_file_type_email_expired_and_expiring_interface.js'
import { SetProceedingFileToEmailInterface } from '../interfaces/set_proceeding_file_to_email_interface.js'

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
    const emails = [] as Array<ProceedingFileTypeEmailExpiredAndExpiringInterface>
    for await (const item of proceedingFileTypeEmail) {
      const newEmail = {
        email: item.proceedingFileTypeEmailEmail,
        employeesProceedingFilesExpired: [],
        employeesProceedingFilesExpiring: [],
        pilotsProceedingFilesExpired: [],
        pilotsProceedingFilesExpiring: [],
        aircraftsProceedingFilesExpired: [],
        aircraftsProceedingFilesExpiring: [],
        customersProceedingFilesExpired: [],
        customersProceedingFilesExpiring: [],
        flightAttendantsProceedingFilesExpired: [],
        flightAttendantsProceedingFilesExpiring: [],
      } as ProceedingFileTypeEmailExpiredAndExpiringInterface
      emails.push(newEmail)
    }

    const employeesProceedingFiles = await this.getExpiredAndExpiring(filters, 'employee')
    for await (const proceedingFile of employeesProceedingFiles.proceedingFilesExpired) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'employee',
        type: 'expired',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }

    for await (const proceedingFile of employeesProceedingFiles.proceedingFilesExpiring) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'employee',
        type: 'expiring',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }

    const pilotsProceedingFiles = await this.getExpiredAndExpiring(filters, 'pilot')
    for await (const proceedingFile of pilotsProceedingFiles.proceedingFilesExpired) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'pilot',
        type: 'expired',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }

    for await (const proceedingFile of pilotsProceedingFiles.proceedingFilesExpiring) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'pilot',
        type: 'expiring',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }

    const aircraftProceedingFiles = await this.getExpiredAndExpiring(filters, 'aircraft')
    for await (const proceedingFile of aircraftProceedingFiles.proceedingFilesExpired) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'aircraft',
        type: 'expired',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }
    for await (const proceedingFile of aircraftProceedingFiles.proceedingFilesExpiring) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'aircraft',
        type: 'expiring',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }

    const customersProceedingFiles = await this.getExpiredAndExpiring(filters, 'customer')
    for await (const proceedingFile of customersProceedingFiles.proceedingFilesExpired) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'customer',
        type: 'expired',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }

    for await (const proceedingFile of customersProceedingFiles.proceedingFilesExpiring) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'customer',
        type: 'expiring',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }
    const flightAttendantsProceedingFiles = await this.getExpiredAndExpiring(
      filters,
      'flight-attendant'
    )
    for await (const proceedingFile of flightAttendantsProceedingFiles.proceedingFilesExpired) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'flight-attendant',
        type: 'expired',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }
    for await (const proceedingFile of flightAttendantsProceedingFiles.proceedingFilesExpiring) {
      const filtersToSetEmail = {
        emails: emails,
        proceedingFile: proceedingFile,
        areaToUse: 'flight-attendant',
        type: 'expiring',
      } as SetProceedingFileToEmailInterface
      await this.setProceedingFileToEmail(filtersToSetEmail)
    }

    const userEmail = env.get('SMTP_USERNAME')
    if (userEmail) {
      for await (const email of emails) {
        if (
          email.employeesProceedingFilesExpired.length > 0 ||
          email.pilotsProceedingFilesExpired.length > 0 ||
          email.aircraftsProceedingFilesExpired.length > 0 ||
          email.customersProceedingFilesExpired.length > 0 ||
          email.flightAttendantsProceedingFilesExpired.length > 0 ||
          email.employeesProceedingFilesExpiring.length > 0 ||
          email.pilotsProceedingFilesExpiring.length > 0 ||
          email.aircraftsProceedingFilesExpiring.length > 0 ||
          email.customersProceedingFilesExpiring.length > 0 ||
          email.flightAttendantsProceedingFilesExpiring.length > 0
        ) {
          const dateNow = Math.round(DateTime.now().toSeconds())
          await mail.send((message) => {
            message
              .to(email.email)
              .from(userEmail, 'SAE')
              .subject(`Matrix Expiration Alert -  ${dateNow}`)
              .htmlView('emails/proceeding_files_report', {
                employeesProceedingFilesExpired: email.employeesProceedingFilesExpired || [],
                employeesProceedingFilesExpiring: email.employeesProceedingFilesExpiring || [],
                pilotsProceedingFilesExpired: email.pilotsProceedingFilesExpired || [],
                pilotsProceedingFilesExpiring: email.pilotsProceedingFilesExpiring || [],
                aircraftsProceedingFilesExpired: email.aircraftsProceedingFilesExpired || [],
                aircraftsProceedingFilesExpiring: email.aircraftsProceedingFilesExpiring || [],
                customersProceedingFilesExpired: email.customersProceedingFilesExpired || [],
                customersProceedingFilesExpiring: email.customersProceedingFilesExpiring || [],
                flightAttendantsProceedingFilesExpired:
                  email.flightAttendantsProceedingFilesExpired || [],
                flightAttendantsProceedingFilesExpiring:
                  email.flightAttendantsProceedingFilesExpiring || [],
              })
          })
        }
      }
    }
    return emails
  }

  async setProceedingFileToEmail(filtersToSetEmail: SetProceedingFileToEmailInterface) {
    const proceedingFileTypeService = new ProceedingFileTypeService()
    const dateExpired = DateTime.fromJSDate(
      new Date(filtersToSetEmail.proceedingFile.proceedingFileExpirationAt)
    )
    filtersToSetEmail.proceedingFile.proceedingFileExpirationAt = dateExpired
      .setLocale('en')
      .toFormat(`cccc, dd LLLL yyyy`)
    const proceedingFileTypeEmails = await proceedingFileTypeService.getAllEmailParents(
      filtersToSetEmail.proceedingFile.proceedingFileType.proceedingFileTypeId
    )
    if (filtersToSetEmail.proceedingFile.proceedingFileType.emails.length > 0) {
      for await (const email of filtersToSetEmail.proceedingFile.proceedingFileType.emails) {
        proceedingFileTypeEmails.push(email)
      }
    }
    for await (const email of proceedingFileTypeEmails) {
      const existEmail = filtersToSetEmail.emails.find(
        (a) => a.email === email.proceedingFileTypeEmailEmail
      )
      if (existEmail) {
        if (filtersToSetEmail.type === 'expired') {
          switch (filtersToSetEmail.areaToUse) {
            case 'employee':
              await this.savingProceedingFileInEmail(
                existEmail.employeesProceedingFilesExpired,
                filtersToSetEmail.proceedingFile
              )
              break
            case 'pilot':
              await this.savingProceedingFileInEmail(
                existEmail.pilotsProceedingFilesExpired,
                filtersToSetEmail.proceedingFile
              )
              break
            case 'aircraft':
              await this.savingProceedingFileInEmail(
                existEmail.aircraftsProceedingFilesExpired,
                filtersToSetEmail.proceedingFile
              )
              break
            case 'customer':
              await this.savingProceedingFileInEmail(
                existEmail.customersProceedingFilesExpired,
                filtersToSetEmail.proceedingFile
              )
              break
            case 'flight-attendant':
              await this.savingProceedingFileInEmail(
                existEmail.flightAttendantsProceedingFilesExpired,
                filtersToSetEmail.proceedingFile
              )
              break
            default:
              break
          }
        } else if (filtersToSetEmail.type === 'expiring') {
          switch (filtersToSetEmail.areaToUse) {
            case 'employee':
              await this.savingProceedingFileInEmail(
                existEmail.employeesProceedingFilesExpiring,
                filtersToSetEmail.proceedingFile
              )
              break
            case 'pilot':
              await this.savingProceedingFileInEmail(
                existEmail.pilotsProceedingFilesExpiring,
                filtersToSetEmail.proceedingFile
              )
              break
            case 'aircraft':
              await this.savingProceedingFileInEmail(
                existEmail.aircraftsProceedingFilesExpiring,
                filtersToSetEmail.proceedingFile
              )
              break
            case 'customer':
              await this.savingProceedingFileInEmail(
                existEmail.customersProceedingFilesExpiring,
                filtersToSetEmail.proceedingFile
              )
              break
            case 'flight-attendant':
              await this.savingProceedingFileInEmail(
                existEmail.flightAttendantsProceedingFilesExpiring,
                filtersToSetEmail.proceedingFile
              )
              break
            default:
              break
          }
        }
      }
    }
  }

  savingProceedingFileInEmail(
    proceedingFiles: Array<ProceedingFile>,
    proceedingFile: ProceedingFile
  ) {
    const existFile = proceedingFiles.find(
      (a: { proceedingFileId: number }) => a.proceedingFileId === proceedingFile.proceedingFileId
    )
    if (!existFile) {
      proceedingFiles.push(proceedingFile)
    }
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
      .preload('employeeProceedingFile', (query) => {
        query.preload('employee')
      })
      .preload('pilotProceedingFile', (query) => {
        query.preload('pilot', (queryPilot) => {
          queryPilot.preload('employee', (queryEmployee) => {
            queryEmployee.preload('person')
          })
        })
      })
      .preload('aircraftProceedingFile', (query) => {
        query.preload('aircraft')
      })
      .preload('customerProceedingFile', (query) => {
        query.preload('customer', (queryCustomer) => {
          queryCustomer.preload('person')
        })
      })
      .preload('flightAttendantProceedingFile', (query) => {
        query.preload('flightAttendant', (queryFlightAttendant) => {
          queryFlightAttendant.preload('person')
        })
      })
      .orderBy('proceeding_file_expiration_at')

    const newDateStart = DateTime.fromISO(filters.dateEnd).plus({ days: 1 }).toFormat('yyyy-MM-dd')
    const newDateEnd = DateTime.fromISO(filters.dateEnd).plus({ days: 30 }).toFormat('yyyy-MM-dd')
    const proceedingFilesExpiring = await ProceedingFile.query()
      .whereNull('proceeding_file_deleted_at')
      .whereIn('proceeding_file_type_id', proceedingFileTypesIds)
      .whereBetween('proceeding_file_expiration_at', [newDateStart, newDateEnd])
      .preload('proceedingFileType', (query) => {
        query.preload('emails')
      })
      .preload('employeeProceedingFile', (query) => {
        query.preload('employee')
      })
      .preload('pilotProceedingFile', (query) => {
        query.preload('pilot', (queryPilot) => {
          queryPilot.preload('employee', (queryEmployee) => {
            queryEmployee.preload('person')
          })
        })
      })
      .preload('aircraftProceedingFile', (query) => {
        query.preload('aircraft')
      })
      .preload('customerProceedingFile', (query) => {
        query.preload('customer', (queryCustomer) => {
          queryCustomer.preload('person')
        })
      })
      .preload('flightAttendantProceedingFile', (query) => {
        query.preload('flightAttendant', (queryFlightAttendant) => {
          queryFlightAttendant.preload('employee', (queryEmployee) => {
            queryEmployee.preload('person')
          })
        })
      })
      .orderBy('proceeding_file_expiration_at')

    return {
      proceedingFilesExpired: proceedingFilesExpired ? proceedingFilesExpired : [],
      proceedingFilesExpiring: proceedingFilesExpiring ? proceedingFilesExpiring : [],
    }
  }
}
