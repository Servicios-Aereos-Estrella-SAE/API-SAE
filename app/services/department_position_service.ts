import Department from '#models/department'
import DepartmentPosition from '#models/department_position'
import Position from '#models/position'

export default class DepartmentPositionService {
  async syncCreate(departmentId: number, positionId: number) {
    const newDepartmentPosition = new DepartmentPosition()
    newDepartmentPosition.departmentId = departmentId
    newDepartmentPosition.positionId = positionId
    newDepartmentPosition.departmentPositionLastSynchronizationAt = new Date()
    await newDepartmentPosition.save()
    return newDepartmentPosition
  }

  async create(departmentPosition: DepartmentPosition) {
    const newDepartmentPosition = new DepartmentPosition()
    newDepartmentPosition.departmentId = departmentPosition.departmentId
    newDepartmentPosition.positionId = departmentPosition.positionId
    await newDepartmentPosition.save()
    return newDepartmentPosition
  }

  async update(
    currentDepartmentPosition: DepartmentPosition,
    departmentPosition: DepartmentPosition
  ) {
    currentDepartmentPosition.departmentId = departmentPosition.departmentId
    currentDepartmentPosition.positionId = departmentPosition.positionId
    await currentDepartmentPosition.save()
    return currentDepartmentPosition
  }

  async delete(currentDepartmentPosition: DepartmentPosition) {
    await currentDepartmentPosition.delete()
    return currentDepartmentPosition
  }

  async show(departmentPositionId: number) {
    const departmentPosition = await DepartmentPosition.query()
      .whereNull('department_position_deleted_at')
      .where('department_position_id', departmentPositionId)
      .first()
    return departmentPosition ? departmentPosition : null
  }

  async verifyInfoExist(departmentPosition: DepartmentPosition) {
    const existDepartment = await Department.query()
      .whereNull('department_deleted_at')
      .where('department_id', departmentPosition.departmentId)
      .first()

    if (!existDepartment && departmentPosition.departmentId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The department was not found',
        message: 'The department was not found with the entered ID',
        data: { ...departmentPosition },
      }
    }

    const existPosition = await Position.query()
      .whereNull('position_deleted_at')
      .where('position_id', departmentPosition.positionId)
      .first()

    if (!existPosition && departmentPosition.positionId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The position was not found',
        message: 'The position was not found with the entered ID',
        data: { ...departmentPosition },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...departmentPosition },
    }
  }

  async verifyInfo(departmentPosition: DepartmentPosition) {
    const action = departmentPosition.departmentPositionId > 0 ? 'updated' : 'created'
    const existDepartmentPosition = await DepartmentPosition.query()
      .whereNull('department_position_deleted_at')
      .if(departmentPosition.departmentPositionId > 0, (query) => {
        query.whereNot('department_position_id', departmentPosition.departmentPositionId)
      })
      .where('department_id', departmentPosition.departmentId)
      .where('position_id', departmentPosition.positionId)
      .first()
    if (existDepartmentPosition) {
      return {
        status: 400,
        type: 'warning',
        title: 'The relation department-position already exists',
        message: `The relation department-position resource cannot be ${action} because the relation is already assigned`,
        data: { ...departmentPosition },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...departmentPosition },
    }
  }
}
