import ProceedingFileType from '#models/proceeding_file_type'
import { ProceedingFileTypeFilterSearchInterface } from '../interfaces/proceeding_file_type_filter_search_interface.js'
import env from '#start/env'

export default class ProceedingFileTypeService {
  async index(filters: ProceedingFileTypeFilterSearchInterface) {
    const systemBussines = env.get('SYSTEM_BUSINESS')
    const systemBussinesArray = systemBussines?.toString().split(',') as Array<string>
    const proceedingFileTypes = await ProceedingFileType.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(proceeding_file_type_name) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
      })
      .andWhere((query) => {
        query.whereNotNull('proceeding_file_type_business_units')
        query.andWhere((subQuery) => {
          systemBussinesArray.forEach((business) => {
            subQuery.orWhereRaw('FIND_IN_SET(?, proceeding_file_type_business_units)', [
              business.trim(),
            ])
          })
        })
      })
      .orderBy('proceeding_file_type_name', 'asc')
      .whereNull('parent_id')
      .paginate(filters.page, filters.limit)
    return proceedingFileTypes
  }

  async indexByArea(areaToUse: string) {
    const systemBussines = env.get('SYSTEM_BUSINESS')
    const systemBussinesArray = systemBussines?.toString().split(',') as Array<string>
    const proceedingFileTypes = await ProceedingFileType.query()
      .if(areaToUse, (query) => {
        query.where('proceeding_file_type_area_to_use', areaToUse)
      })
      .andWhere((query) => {
        query.whereNotNull('proceeding_file_type_business_units')
        query.andWhere((subQuery) => {
          systemBussinesArray.forEach((business) => {
            subQuery.orWhereRaw('FIND_IN_SET(?, proceeding_file_type_business_units)', [
              business.trim(),
            ])
          })
        })
      })
      .whereNull('parent_id')
      .preload('children')
      .orderBy('proceeding_file_type_name', 'asc')
    return proceedingFileTypes
  }

  async store(proceedingFileType: ProceedingFileType) {
    const newProceedingFileType = new ProceedingFileType()
    newProceedingFileType.proceedingFileTypeName = proceedingFileType.proceedingFileTypeName
    newProceedingFileType.proceedingFileTypeSlug = proceedingFileType.proceedingFileTypeSlug
    newProceedingFileType.proceedingFileTypeAreaToUse =
      proceedingFileType.proceedingFileTypeAreaToUse
    newProceedingFileType.proceedingFileTypeActive = proceedingFileType.proceedingFileTypeActive
    await newProceedingFileType.save()
    return newProceedingFileType
  }

  async update(
    currenProceedingFileType: ProceedingFileType,
    proceedingFileType: ProceedingFileType
  ) {
    currenProceedingFileType.proceedingFileTypeName = proceedingFileType.proceedingFileTypeName
    currenProceedingFileType.proceedingFileTypeSlug = proceedingFileType.proceedingFileTypeSlug
    currenProceedingFileType.proceedingFileTypeAreaToUse =
      proceedingFileType.proceedingFileTypeAreaToUse
    currenProceedingFileType.proceedingFileTypeActive = proceedingFileType.proceedingFileTypeActive
    await currenProceedingFileType.save()
    return currenProceedingFileType
  }

  async delete(currenProceedingFileType: ProceedingFileType) {
    await currenProceedingFileType.delete()
    return currenProceedingFileType
  }

  async show(proceedingFileTypeId: number) {
    const proceedingFileType = await ProceedingFileType.query()
      .whereNull('proceeding_file_type_deleted_at')
      .where('proceeding_file_type_id', proceedingFileTypeId)
      .preload('children')
      .preload('emails')
      .first()
    return proceedingFileType ? proceedingFileType : null
  }

  async getLegacyEmails(proceedingFileTypeId: number) {
    const emails = await this.getAllEmailParents(proceedingFileTypeId)
    return emails
  }

  async getAllEmailParents(proceedingFileTypeId: number) {
    const emails = []
    let currentRecord = await ProceedingFileType.find(proceedingFileTypeId)
    while (currentRecord && currentRecord.parentId) {
      const parent = await currentRecord.related('parent').query().preload('emails').first()
      if (parent) {
        for await (const email of parent.emails) {
          emails.push(email)
        }
        currentRecord = parent
      } else {
        break
      }
    }
    return emails
  }

  async verifyInfo(proceedingFileType: ProceedingFileType) {
    const action = proceedingFileType.proceedingFileTypeId > 0 ? 'updated' : 'created'
    const existProceedingFileTypeName = await ProceedingFileType.query()
      .if(proceedingFileType.proceedingFileTypeId > 0, (query) => {
        query.whereNot('proceedingFileTypeId', proceedingFileType.proceedingFileTypeId)
      })
      .whereNull('deletedAt')
      .where('proceedingFileTypeName', proceedingFileType.proceedingFileTypeName)
      .where('proceedingFileTypeAreaToUse', proceedingFileType.proceedingFileTypeAreaToUse)
      .first()
    if (existProceedingFileTypeName && proceedingFileType.proceedingFileTypeName) {
      return {
        status: 400,
        type: 'warning',
        title: 'The proceeding file type name exists for another proceeding file type',
        message: `The proceeding file type resource cannot be ${action} because the roceeding file type name is already assigned to another proceeding file type`,
        data: { ...proceedingFileType },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...proceedingFileType },
    }
  }
}
