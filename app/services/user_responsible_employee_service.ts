import UserResponsibleEmployee from '#models/user_responsible_employee'
import User from '#models/user'
import Employee from '#models/employee'

export default class UserResponsibleEmployeeService {
  async create(userResponsibleEmployee: UserResponsibleEmployee) {
    const newUserResponsibleEmployee = new UserResponsibleEmployee()
    newUserResponsibleEmployee.userId = userResponsibleEmployee.userId
    newUserResponsibleEmployee.employeeId = userResponsibleEmployee.employeeId
    await newUserResponsibleEmployee.save()
    return newUserResponsibleEmployee
  }

  async delete(currentUserResponsibleEmployee: UserResponsibleEmployee) {
    await currentUserResponsibleEmployee.delete()
    return currentUserResponsibleEmployee
  }

  async show(userResponsibleEmployeeId: number) {
    const userResponsibleEmployee = await UserResponsibleEmployee.query()
      .whereNull('user_responsible_employee_deleted_at')
      .where('user_responsible_employee_id', userResponsibleEmployeeId)
      .preload('user')
      .first()
    return userResponsibleEmployee ? userResponsibleEmployee : null
  }

  async verifyInfoExist(userResponsibleEmployee: UserResponsibleEmployee) {
    const existUser = await User.query()
      .whereNull('user_deleted_at')
      .where('user_id', userResponsibleEmployee.userId)
      .first()

    if (!existUser && userResponsibleEmployee.userId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The user was not found',
        message: 'The user was not found with the entered ID',
        data: { ...userResponsibleEmployee },
      }
    }

    const existEmployee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', userResponsibleEmployee.employeeId)
      .first()

    if (!existEmployee && userResponsibleEmployee.employeeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee was not found',
        message: 'The employee was not found with the entered ID',
        data: { ...userResponsibleEmployee },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...userResponsibleEmployee },
    }
  }

  async verifyInfo(userResponsibleEmployee: UserResponsibleEmployee) {
    const action = userResponsibleEmployee.userResponsibleEmployeeId > 0 ? 'updated' : 'created'
    const existRelation = await UserResponsibleEmployee.query()
      .if(userResponsibleEmployee.userResponsibleEmployeeId > 0, (query) => {
        query.whereNot('user_responsible_employee_id', userResponsibleEmployee.userResponsibleEmployeeId)
      })
      .whereNull('user_responsible_employee_deleted_at')
      .where('user_id', userResponsibleEmployee.userId)
      .where('employee_id', userResponsibleEmployee.employeeId)
      .first()
    if (existRelation) {
      return {
        status: 400,
        type: 'warning',
        title: 'The user responsible employee already exists for another record',
        message: `The user responsible employee resource cannot be ${action} because the relationship is already assigned to another record`,
        data: { ...userResponsibleEmployee },
      }
    }

    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...userResponsibleEmployee },
    }
  }
}
