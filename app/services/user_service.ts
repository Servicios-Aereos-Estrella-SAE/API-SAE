import Ws from '#services/ws'
import Person from '#models/person'
import User from '#models/user'
import { UserFilterSearchInterface } from '../interfaces/user_filter_search_interface.js'
import ApiToken from '#models/api_token'
import RoleDepartment from '#models/role_department'
import Department from '#models/department'
import { DateTime } from 'luxon'
import { LogStore } from '#models/MongoDB/log_store'
import { LogUser } from '../interfaces/MongoDB/log_user.js'
import mail from '@adonisjs/mail/services/main'
import env from '../../start/env.js'
import Role from '#models/role'
import SystemSettingService from './system_setting_service.js'
import SystemSetting from '#models/system_setting'
import BusinessUnit from '#models/business_unit'
// import BusinessUnit from '#models/business_unit'

export default class UserService {
  async index(filters: UserFilterSearchInterface) {
    const systemBussines = env.get('SYSTEM_BUSINESS')
    const systemBussinesArray = systemBussines?.toString().split(',') as Array<string>

    const roles = await Role.query()
      .whereNull('role_deleted_at')
      .andWhere((query) => {
        query.whereNotNull('role_business_access')
        query.andWhere((subQuery) => {
          systemBussinesArray.forEach((business) => {
            subQuery.orWhereRaw('FIND_IN_SET(?, role_business_access)', [business.trim()])
          })
        })
      })
    const rolesIds = roles.map((item) => item.roleId)

    const selectedColumns = ['user_id', 'user_email', 'user_active', 'role_id', 'person_id']
    const users = await User.query()
      .whereNull('user_deleted_at')
      .whereIn('role_id', rolesIds)
      .andWhere((query) => {
        query.whereNotNull('user_business_access')
        query.andWhere((subQuery) => {
          systemBussinesArray.forEach((business) => {
            subQuery.orWhereRaw('FIND_IN_SET(?, user_business_access)', [business.trim()])
          })
        })
      })
      .if(filters.search, (query) => {
        query.andWhere((searchQuery) => {
          searchQuery
            .whereRaw('UPPER(user_email) LIKE ?', [`%${filters.search.toUpperCase()}%`])
            .orWhereHas('person', (queryPerson) => {
              queryPerson.whereRaw(
                'UPPER(CONCAT(person_firstname, " ", person_lastname, " ", person_second_lastname)) LIKE ?',
                [`%${filters.search.toUpperCase()}%`]
              )
            })
        })
      })
      .if(filters.roleId > 0, (query) => {
        query.where('role_id', filters.roleId)
      })
      .whereHas('person', (query) => {
        query.whereNull('person_deleted_at')
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
    newUser.userBusinessAccess = user.userBusinessAccess
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
    currentUser.personId = user.personId
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
      .preload('person')
      .preload('role')
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

  async getRoleDepartments(userId: number) {
    const user = await User.query()
      .whereNull('user_deleted_at')
      .where('user_id', userId)
      .preload('role')
      .first()

    if (!user) {
      return []
    }

    if (user.role.roleSlug === 'root') {
      const departmentsList = await Department.query()
        .whereNull('department_deleted_at')
        .orderBy('departmentId')

      const departments = departmentsList.map((department) => department.departmentId)
      return departments
    }
    const businessConf = `${env.get('SYSTEM_BUSINESS')}`
    const businessList = businessConf.split(',')
    const businessUnits = await BusinessUnit.query()
      .where('business_unit_active', 1)
      .whereIn('business_unit_slug', businessList)

    const businessUnitsList = businessUnits.map((business) => business.businessUnitId)

    const roleDepartments = await RoleDepartment.query()
      .whereNull('role_department_deleted_at')
      .where('roleId', user.role?.roleId)
      .whereHas('department', (query) => {
        query.whereIn('businessUnitId', businessUnitsList)
      })
      .distinct('departmentId')
      .orderBy('departmentId')

    const departments = roleDepartments.map((roleDepartment) => roleDepartment.departmentId)
    return departments
  }

  createActionLog(rawHeaders: string[], action: string) {
    const date = DateTime.local().setZone('utc').toISO()
    const userAgent = this.getHeaderValue(rawHeaders, 'User-Agent')
    const secChUaPlatform = this.getHeaderValue(rawHeaders, 'sec-ch-ua-platform')
    const secChUa = this.getHeaderValue(rawHeaders, 'sec-ch-ua')
    const origin = this.getHeaderValue(rawHeaders, 'Origin')
    const logUser = {
      action: action,
      user_agent: userAgent,
      sec_ch_ua_platform: secChUaPlatform,
      sec_ch_ua: secChUa,
      origin: origin,
      date: date ? date : '',
    } as LogUser
    return logUser
  }

  async saveActionOnLog(logAssist: LogUser) {
    try {
      await LogStore.set('log_users', logAssist)
    } catch (err) {}
  }

  getHeaderValue(headers: Array<string>, headerName: string) {
    const index = headers.indexOf(headerName)
    return index !== -1 ? headers[index + 1] : null
  }

  async sendNewPasswordEmail(url: string, newUser: User, userPassword: string) {
    const hostData = this.getUrlInfo(url)
    let tradeName = 'BO'
    let backgroundImageLogo = `${env.get('BACKGROUND_IMAGE_LOGO')}`
    const systemSettingService = new SystemSettingService()
    const systemSettingActive = (await systemSettingService.getActive()) as unknown as SystemSetting
    if (systemSettingActive) {
      if ( systemSettingActive.systemSettingLogo) {
        backgroundImageLogo = systemSettingActive.systemSettingLogo
      }
      if ( systemSettingActive.systemSettingTradeName) {
        tradeName = systemSettingActive.systemSettingTradeName
      }
    }
    await newUser.load('person')
    const emailData = {
      user: newUser,
      userPassword,
      host_data: hostData,
      backgroundImageLogo,
    }
    const userEmail = env.get('SMTP_USERNAME')
    if (userEmail) {
      await mail.send((message) => {
        message
          .to(newUser.userEmail)
          .from(userEmail, tradeName)
          .subject('New password')
          .htmlView('emails/new_password', emailData)
      })
    }
  }

  private getUrlInfo(url: string) {
    return {
      name: 'SAE BackOffice',
      host_uri: url,
      logo_path: 'https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg',
      primary_color: '#0a3459',
    }
  }
}
