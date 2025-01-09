import WorkDisability from '#models/work_disability'
import InsuranceCoverageType from '#models/insurance_coverage_type'
import Employee from '#models/employee'
import { WorkDisabilityFilterSearchInterface } from '../interfaces/work_disability_filter_search_interface.js'

export default class WorkDisabilityService {
  async create(workDisability: WorkDisability) {
    const newWorkDisability = new WorkDisability()
    newWorkDisability.workDisabilityUuid = workDisability.workDisabilityUuid
    newWorkDisability.employeeId = workDisability.employeeId
    newWorkDisability.insuranceCoverageTypeId = workDisability.insuranceCoverageTypeId
    await newWorkDisability.save()
    return newWorkDisability
  }

  async update(currentWorkDisability: WorkDisability, workDisability: WorkDisability) {
    currentWorkDisability.employeeId = workDisability.employeeId
    currentWorkDisability.insuranceCoverageTypeId = workDisability.insuranceCoverageTypeId
    await currentWorkDisability.save()
    return currentWorkDisability
  }

  async delete(currentWorkDisability: WorkDisability) {
    await currentWorkDisability.delete()
    return currentWorkDisability
  }

  async show(workDisabilityId: number) {
    const workDisability = await WorkDisability.query()
      .whereNull('work_disability_deleted_at')
      .where('work_disability_id', workDisabilityId)
      .preload('insuranceCoverageType')
      .preload('employee')
      .first()
    return workDisability ? workDisability : null
  }

  async index(filters: WorkDisabilityFilterSearchInterface) {
    const workDisabilities = await WorkDisability.query()
      .whereNull('work_disability_deleted_at')
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(work_disability_uuid) LIKE ?', [`%${filters.search.toUpperCase()}%`])
      })
      .orderBy('work_disability_id')
      .paginate(filters.page, filters.limit)
    return workDisabilities
  }

  async getByEmployee(filters: WorkDisabilityFilterSearchInterface) {
    const workDisabilities = await WorkDisability.query()
      .whereNull('work_disability_deleted_at')
      .if(filters.employeeId, (query) => {
        query.where('employee_id', filters.employeeId)
      })
      .preload('insuranceCoverageType')
      .orderBy('work_disability_id')
    return workDisabilities
  }

  async verifyInfoExist(workDisability: WorkDisability) {
    const existEmployee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', workDisability.employeeId)
      .first()

    if (!existEmployee && workDisability.employeeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee was not found',
        message: 'The employee was not found with the entered ID',
        data: { ...workDisability },
      }
    }

    const existInsuranceCoverageType = await InsuranceCoverageType.query()
      .whereNull('insurance_coverage_type_deleted_at')
      .where('insurance_coverage_type_id', workDisability.insuranceCoverageTypeId)
      .first()

    if (!existInsuranceCoverageType && workDisability.insuranceCoverageTypeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The insurance coverage type was not found',
        message: 'The insurance coverage type was not found with the entered ID',
        data: { ...workDisability },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...workDisability },
    }
  }

  async verifyInfo(workDisability: WorkDisability) {
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...workDisability },
    }
  }
}
