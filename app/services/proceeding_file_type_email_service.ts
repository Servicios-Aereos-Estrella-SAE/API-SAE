import ProceedingFileType from '#models/proceeding_file_type'
import ProceedingFileTypeEmail from '#models/proceeding_file_type_email'
import ProceedingFileTypeService from './proceeding_file_type_service.js'

export default class ProceedingFileTypeEmailService {
  async create(proceedingFileTypeEmail: ProceedingFileTypeEmail) {
    const newProceedingFileTypeEmail = new ProceedingFileTypeEmail()
    newProceedingFileTypeEmail.proceedingFileTypeId = proceedingFileTypeEmail.proceedingFileTypeId
    newProceedingFileTypeEmail.proceedingFileTypeEmailEmail =
      proceedingFileTypeEmail.proceedingFileTypeEmailEmail
    await newProceedingFileTypeEmail.save()
    return newProceedingFileTypeEmail
  }

  async update(
    currentProceedingFileTypeEmail: ProceedingFileTypeEmail,
    proceedingFileTypeEmail: ProceedingFileTypeEmail
  ) {
    currentProceedingFileTypeEmail.proceedingFileTypeId =
      proceedingFileTypeEmail.proceedingFileTypeId
    currentProceedingFileTypeEmail.proceedingFileTypeEmailEmail =
      proceedingFileTypeEmail.proceedingFileTypeEmailEmail
    await currentProceedingFileTypeEmail.save()
    return currentProceedingFileTypeEmail
  }

  async delete(currentProceedingFileTypeEmail: ProceedingFileTypeEmail) {
    await currentProceedingFileTypeEmail.delete()
    return currentProceedingFileTypeEmail
  }

  async show(proceedingFileTypeEmailId: number) {
    const proceedingFileTypeEmail = await ProceedingFileTypeEmail.query()
      .whereNull('proceeding_file_type_email_deleted_at')
      .where('proceeding_file_type_email_id', proceedingFileTypeEmailId)
      .first()
    return proceedingFileTypeEmail ? proceedingFileTypeEmail : null
  }

  async index() {
    const proceedingFileTypeEmail = await ProceedingFileTypeEmail.query()
      .whereNull('proceeding_file_type_email_deleted_at')
      .orderBy('proceeding_file_type_email_id')
    return proceedingFileTypeEmail ? proceedingFileTypeEmail : []
  }

  async verifyInfoExist(proceedingFileTypeEmail: ProceedingFileTypeEmail) {
    const existProceedingFileType = await ProceedingFileType.query()
      .whereNull('proceeding_file_type_deleted_at')
      .where('proceeding_file_type_id', proceedingFileTypeEmail.proceedingFileTypeId)
      .first()

    if (!existProceedingFileType && proceedingFileTypeEmail.proceedingFileTypeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file type was not found',
        message: 'The proceeding file type was not found with the entered ID',
        data: { ...proceedingFileTypeEmail },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...proceedingFileTypeEmail },
    }
  }

  async verifyInfo(proceedingFileTypeEmail: ProceedingFileTypeEmail) {
    const action = proceedingFileTypeEmail.proceedingFileTypeEmailId > 0 ? 'updated' : 'created'
    const existProceedingFileTypeEmail = await ProceedingFileTypeEmail.query()
      .whereNull('proceeding_file_type_email_deleted_at')
      .if(proceedingFileTypeEmail.proceedingFileTypeEmailId > 0, (query) => {
        query.whereNot(
          'proceeding_file_type_email_id',
          proceedingFileTypeEmail.proceedingFileTypeEmailId
        )
      })
      .where('proceeding_file_type_id', proceedingFileTypeEmail.proceedingFileTypeId)
      .where(
        'proceeding_file_type_email_email',
        proceedingFileTypeEmail.proceedingFileTypeEmailEmail
      )
      .first()
    if (existProceedingFileTypeEmail) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file type email already exists',
        message: `The proceeding file type email resource cannot be ${action} because the relation is already assigned`,
        data: { ...proceedingFileTypeEmail },
      }
    }
    const proceedingFileTypeService = new ProceedingFileTypeService()
    const legacyEmails = await proceedingFileTypeService.getAllEmailParents(
      proceedingFileTypeEmail.proceedingFileTypeId
    )
    const existLegacyEmail = legacyEmails.find(
      (a) => a.proceedingFileTypeEmailEmail === proceedingFileTypeEmail.proceedingFileTypeEmailEmail
    )
    if (existLegacyEmail) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file type email already exists',
        message: `The proceeding file type email resource cannot be ${action} because the email is already assigned in parent`,
        data: { ...proceedingFileTypeEmail },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...proceedingFileTypeEmail },
    }
  }
}
