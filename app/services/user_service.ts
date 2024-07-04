import Ws from '#services/ws'
import Person from '#models/person'
import User from '#models/user'
import { UserFilterSearchInterface } from '../interfaces/user_filter_search_interface.js'
import ApiToken from '#models/api_token'

export default class UserService {
  async index(filters: UserFilterSearchInterface) {
    const selectedColumns = ['user_id', 'user_email', 'user_active', 'role_id', 'person_id']
    const users = await User.query()
      .if(filters.roleId > 0, (query) => {
        query.where('role_id', filters.roleId)
      })
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(user_email) LIKE ?', [`%${filters.search.toUpperCase()}%`])
        query.orWhereHas('person', (queryPerson) => {
          queryPerson.whereRaw(
            'UPPER(CONCAT(person_firstname, " ", person_lastname, " ", person_second_lastname)) LIKE ?',
            [`%${filters.search.toUpperCase()}%`]
          )
        })
      })
      .whereHas('person', (builder) => {
        builder.whereNull('person_deleted_at')
      })
      .preload('person')
      .preload('role')
      .select(selectedColumns)
      .orderBy('user_id')
      .paginate(filters.page, filters.limit)
    return users
  }

  async create(user: User) {
    const newUser = new User()
    newUser.userEmail = user.userEmail
    newUser.userPassword = user.userPassword
    newUser.userActive = user.userActive
    newUser.roleId = user.roleId
    newUser.personId = user.personId
    await newUser.save()
    return newUser
  }

  async update(currentUser: User, user: User) {
    currentUser.userEmail = user.userEmail
    if (user.userPassword) {
      currentUser.userPassword = user.userPassword
    }
    currentUser.userActive = user.userActive
    currentUser.roleId = user.roleId
    await currentUser.save()
    if (!user.userActive) {
      await ApiToken.query().where('tokenable_id', currentUser.userId).delete()
      if (Ws.io) {
        Ws.io.emit(`user-forze-logout:${currentUser.userEmail}`, {})
      }
    }
    return currentUser
  }

  async delete(currentUser: User) {
    await currentUser.delete()
    await ApiToken.query().where('tokenable_id', currentUser.userId).delete()
    if (Ws.io) {
      Ws.io.emit(`user-forze-logout:${currentUser.userEmail}`, {})
    }
    return currentUser
  }

  async show(userId: number) {
    const selectedColumns = ['user_id', 'user_email', 'user_active', 'role_id', 'person_id']
    const user = await User.query()
      .whereNull('user_deleted_at')
      .where('user_id', userId)
      .select(selectedColumns)
      .first()
    return user ? user : null
  }

  async verifyInfo(user: User) {
    const action = user.userId > 0 ? 'updated' : 'created'
    const existEmail = await User.query()
      .if(user.userId > 0, (query) => {
        query.whereNot('user_id', user.userId)
      })
      .whereNull('user_deleted_at')
      .where('user_email', user.userEmail)
      .first()

    if (existEmail && user.userEmail) {
      return {
        status: 400,
        type: 'warning',
        title: 'The user email already exists for another user',
        message: `The user resource cannot be ${action} because the email is already assigned to another user`,
        data: { ...user },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...user },
    }
  }

  async verifyInfoExist(user: User) {
    if (!user.userId) {
      const existUser = await Person.query()
        .whereNull('person_deleted_at')
        .where('person_id', user.personId)
        .first()

      if (!existUser && user.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person was not found',
          message: 'The person was not found with the entered ID',
          data: { ...user },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...user },
    }
  }
}
