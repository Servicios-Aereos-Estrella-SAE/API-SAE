import Employee from '#models/employee'
import EmployeeChildren from '#models/employee_children'

export default class EmployeeChildrenService {
  async create(employeeChildren: EmployeeChildren) {
    const newEmployeeChildren = new EmployeeChildren()
    newEmployeeChildren.employeeChildrenFirstname = employeeChildren.employeeChildrenFirstname
    newEmployeeChildren.employeeChildrenLastname = employeeChildren.employeeChildrenLastname
    newEmployeeChildren.employeeChildrenSecondLastname =
      employeeChildren.employeeChildrenSecondLastname
    newEmployeeChildren.employeeChildrenBirthday = employeeChildren.employeeChildrenBirthday
    newEmployeeChildren.employeeChildrenGender = employeeChildren.employeeChildrenGender
    newEmployeeChildren.employeeId = employeeChildren.employeeId
    await newEmployeeChildren.save()
    return newEmployeeChildren
  }

  async update(currentEmployeeChildren: EmployeeChildren, employeeChildren: EmployeeChildren) {
    currentEmployeeChildren.employeeChildrenFirstname = employeeChildren.employeeChildrenFirstname
    currentEmployeeChildren.employeeChildrenLastname = employeeChildren.employeeChildrenLastname
    currentEmployeeChildren.employeeChildrenSecondLastname =
      employeeChildren.employeeChildrenSecondLastname
    currentEmployeeChildren.employeeChildrenBirthday = employeeChildren.employeeChildrenBirthday
    currentEmployeeChildren.employeeChildrenGender = employeeChildren.employeeChildrenGender
    await currentEmployeeChildren.save()
    return currentEmployeeChildren
  }

  async delete(currentEmployeeChildren: EmployeeChildren) {
    await currentEmployeeChildren.delete()
    return currentEmployeeChildren
  }

  async show(employeeChildrenId: number) {
    const employeeChildren = await EmployeeChildren.query()
      .whereNull('employee_children_deleted_at')
      .where('employee_children_id', employeeChildrenId)
      .first()
    return employeeChildren ? employeeChildren : null
  }

  async verifyInfoExist(employeeChildren: EmployeeChildren) {
    const existEmployee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeChildren.employeeId)
      .first()

    if (!existEmployee && employeeChildren.employeeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee was not found',
        message: 'The employee was not found with the entered ID',
        data: { ...employeeChildren },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...employeeChildren },
    }
  }
}
