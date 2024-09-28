import ProceedingFile from '#models/proceeding_file'
import ProceedingFileHasStatus from '#models/proceeding_file_has_status'
import ProceedingFileStatus from '#models/proceeding_file_status'

export default class ProceedingFileHasStatusService {
  async create(proceedingFileHasStatus: ProceedingFileHasStatus) {
    const newProceedingFileHasStatus = new ProceedingFileHasStatus()
    newProceedingFileHasStatus.proceedingFileId = proceedingFileHasStatus.proceedingFileId
    newProceedingFileHasStatus.proceedingFileStatusId =
      proceedingFileHasStatus.proceedingFileStatusId
    await newProceedingFileHasStatus.save()
    return newProceedingFileHasStatus
  }

  async update(
    currentProceedingFileHasStatus: ProceedingFileHasStatus,
    proceedingFileHasStatus: ProceedingFileHasStatus
  ) {
    currentProceedingFileHasStatus.proceedingFileId = proceedingFileHasStatus.proceedingFileId
    currentProceedingFileHasStatus.proceedingFileStatusId =
      proceedingFileHasStatus.proceedingFileStatusId
    await currentProceedingFileHasStatus.save()
    return currentProceedingFileHasStatus
  }

  async delete(currentProceedingFileHasStatus: ProceedingFileHasStatus) {
    await currentProceedingFileHasStatus.delete()
    return currentProceedingFileHasStatus
  }

  async show(proceedingFileHasStatusId: number) {
    const proceedingFileHasStatus = await ProceedingFileHasStatus.query()
      .whereNull('proceeding_file_has_status_deleted_at')
      .where('proceeding_file_has_status_id', proceedingFileHasStatusId)
      .first()
    return proceedingFileHasStatus ? proceedingFileHasStatus : null
  }

  async verifyInfoExist(proceedingFileHasStatus: ProceedingFileHasStatus) {
    const existProceedingFile = await ProceedingFile.query()
      .whereNull('proceeding_file_deleted_at')
      .where('proceeding_file_id', proceedingFileHasStatus.proceedingFileId)
      .first()

    if (!existProceedingFile && proceedingFileHasStatus.proceedingFileId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file was not found',
        message: 'The proceeding file was not found with the entered ID',
        data: { ...proceedingFileHasStatus },
      }
    }

    const existProceedingFileStatus = await ProceedingFileStatus.query()
      .whereNull('proceeding_file_status_deleted_at')
      .where('proceeding_file_status_id', proceedingFileHasStatus.proceedingFileStatusId)
      .first()

    if (!existProceedingFileStatus && proceedingFileHasStatus.proceedingFileStatusId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file status was not found',
        message: 'The proceeding file status was not found with the entered ID',
        data: { ...proceedingFileHasStatus },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...proceedingFileHasStatus },
    }
  }

  async verifyInfo(proceedingFileHasStatus: ProceedingFileHasStatus) {
    const action = proceedingFileHasStatus.proceedingFileHasStatusId > 0 ? 'updated' : 'created'
    const existProceedingFileHasStatus = await ProceedingFileHasStatus.query()
      .whereNull('proceeding_file_has_status_deleted_at')
      .if(proceedingFileHasStatus.proceedingFileHasStatusId > 0, (query) => {
        query.whereNot(
          'proceeding_file_has_status_id',
          proceedingFileHasStatus.proceedingFileHasStatusId
        )
      })
      .where('proceeding_file_id', proceedingFileHasStatus.proceedingFileId)
      .where('proceeding_file_status_id', proceedingFileHasStatus.proceedingFileStatusId)
      .first()
    if (existProceedingFileHasStatus) {
      return {
        status: 400,
        type: 'warning',
        title: 'The relation proceeding file has status already exists',
        message: `The relation proceeding file has status resource cannot be ${action} because the relation is already assigned`,
        data: { ...proceedingFileHasStatus },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...proceedingFileHasStatus },
    }
  }
}
