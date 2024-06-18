import DepartmentPosition from '#models/department_position'

export default class DepartmentPositionService {
  async syncCreate(departmentId: number, positionId: number) {
    const newDepartmentPosition = new DepartmentPosition()
    newDepartmentPosition.departmentId = departmentId
    newDepartmentPosition.positionId = positionId
    newDepartmentPosition.departmentPositionLastSynchronizationAt = new Date()
    await newDepartmentPosition.save()
    return newDepartmentPosition
  }
}
