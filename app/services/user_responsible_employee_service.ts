import UserResponsibleEmployee from '#models/user_responsible_employee'
import User from '#models/user'
import Employee from '#models/employee'

export default class UserResponsibleEmployeeService {
  async create(userResponsibleEmployee: UserResponsibleEmployee) {
    const newUserResponsibleEmployee = new UserResponsibleEmployee()
    newUserResponsibleEmployee.userId = userResponsibleEmployee.userId
    newUserResponsibleEmployee.employeeId = userResponsibleEmployee.employeeId
    newUserResponsibleEmployee.userResponsibleEmployeeReadonly = userResponsibleEmployee.userResponsibleEmployeeReadonly
    newUserResponsibleEmployee.userResponsibleEmployeeDirectBoss = userResponsibleEmployee.userResponsibleEmployeeDirectBoss
    await newUserResponsibleEmployee.save()
    return newUserResponsibleEmployee
  }

  async update(currentUserResponsibleEmployee: UserResponsibleEmployee, userResponsibleEmployee: UserResponsibleEmployee) {
    currentUserResponsibleEmployee.userId = userResponsibleEmployee.userId
    currentUserResponsibleEmployee.employeeId = userResponsibleEmployee.employeeId
    currentUserResponsibleEmployee.userResponsibleEmployeeReadonly = userResponsibleEmployee.userResponsibleEmployeeReadonly
    currentUserResponsibleEmployee.userResponsibleEmployeeDirectBoss = userResponsibleEmployee.userResponsibleEmployeeDirectBoss
    await currentUserResponsibleEmployee.save()
    return currentUserResponsibleEmployee
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

    if (userResponsibleEmployee.userResponsibleEmployeeDirectBoss) {
      const existDirectBoss = await UserResponsibleEmployee.query()
      .if(userResponsibleEmployee.userResponsibleEmployeeId > 0, (query) => {
        query.whereNot('user_responsible_employee_id', userResponsibleEmployee.userResponsibleEmployeeId)
      })
      .whereNull('user_responsible_employee_deleted_at')
      .where('user_responsible_employee_direct_boss', 1)
      .where('employee_id', userResponsibleEmployee.employeeId)
      .first()
    if (existDirectBoss) {
      return {
        status: 400,
        type: 'warning',
        title: 'There is already a direct boss for this employee in other record',
        message: `The user responsible employee resource cannot be ${action} because there is already a direct boss for this employee`,
        data: { ...userResponsibleEmployee },
      }
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
