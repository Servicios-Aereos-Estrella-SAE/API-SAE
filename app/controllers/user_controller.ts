import User from '../models/user.js'
import Ws from '#services/ws'
import { HttpContext } from '@adonisjs/core/http'
import ApiToken from '../models/api_token.js'
import { uuid } from 'uuidv4'
import mail from '@adonisjs/mail/services/main'
import env from '../../start/env.js'
import UserService from '#services/user_service'
import { createUserValidator, updateUserValidator } from '#validators/user'
import { UserFilterSearchInterface } from '../interfaces/user_filter_search_interface.js'
import { DateTime } from 'luxon'
import { LogStore } from '#models/MongoDB/log_store'
import { LogAuthentication } from '../interfaces/MongoDB/log_authentication.js'
import SystemSettingService from '#services/system_setting_service'

export default class UserController {
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: login
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userEmail:
   *                 type: string
   *                 description: User email
   *                 default: ''
   *               userPassword:
   *                 type: string
   *                 description: User password
   *                 default: ''
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async login({ request, response }: HttpContext) {
    try {
      const userEmail = request.input('userEmail')
      const userPassword = request.input('userPassword')
      const user = await User.query().where('user_email', userEmail).where('user_active', 1).first()

      if (!user) {
        response.status(404)
        return {
          type: 'warning',
          title: 'Login',
          message: 'Incorrect email or password',
          data: { user: {} },
        }
      }

      await ApiToken.query().where('tokenable_id', user.userId).delete()

      if (Ws.io) {
        try {
          Ws.io.emit(`user-forze-logout:${user.userEmail}`, {})
        } catch (error) {}
      }

      const userVerify = await User.verifyCredentials(userEmail, userPassword)
      const token = await User.accessTokens.create(user)

      if (userVerify && token) {
        const date = DateTime.local().setZone('utc').toISO()
        try {
          const rawHeaders = request.request.rawHeaders
          const userService = new UserService()
          const userAgent = userService.getHeaderValue(rawHeaders, 'User-Agent')
          const secChUaPlatform = userService.getHeaderValue(rawHeaders, 'sec-ch-ua-platform')
          const secChUa = userService.getHeaderValue(rawHeaders, 'sec-ch-ua')
          const origin = userService.getHeaderValue(rawHeaders, 'Origin')
          await LogStore.set('log_authentication', {
            user_agent: userAgent,
            sec_ch_ua_platform: secChUaPlatform,
            sec_ch_ua: secChUa,
            origin: origin,
            date: date ? date : '',
            user_id: user.userId,
          } as LogAuthentication)
        } catch (err) {}
        response.status(200)
        return {
          type: 'success',
          title: 'Login',
          message: 'You have successfully logged in',
          data: {
            user: user,
            token: token.value!.release(),
          },
        }
      } else {
        response.status(404)
        return {
          type: 'warning',
          title: 'Login',
          message: 'Incorrect email or password',
          data: { user: {} },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/auth/session:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: get auth user session
   *     produces:
   *       - application/json
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async authUser({ auth, response }: HttpContext) {
    const userData = await auth.authenticateUsing(['api'])
    await auth.use('api').authenticate()

    const user = await User.query()
      .where('user_id', userData.userId)
      .preload('person', (query) => {
        query.preload('employee')
      })
      .preload('role')
      .first()

    response.status(200)
    return response.send(user)
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: logout
   *     produces:
   *       - application/json
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticateUsing(['api'])
      await auth.use('api').authenticate()
      await ApiToken.query().where('tokenable_id', auth.user!.userId).delete()
      response.status(200)
      return {
        type: 'success',
        title: 'Logout',
        message: 'You have successfully logged out',
        data: { user: user },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/auth/recovery:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: password recovery
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userEmail:
   *                 type: string
   *                 description: User email
   *                 default: ''
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async recoveryPassword({ request, response }: HttpContext) {
    try {
      const url = request.header('origin')
      if (url) {
        const hostData = this.getUrlInfo(url)
        const user = await User.query()
          .where('user_email', request.all().userEmail)
          .whereNull('user_deleted_at')
          .preload('person')
          .first()
        const encrypted = uuid()
        if (!user) {
          response.status(404)
          return {
            type: 'warning',
            title: 'Password recovery',
            message: 'Email not found',
            data: {},
          }
        }
        user.userToken = encrypted
        user.save()
        let backgroundImageLogo = `${env.get('BACKGROUND_IMAGE_LOGO')}`
        const systemSettingService = new SystemSettingService()
        const systemSettingActive = await systemSettingService.getActive()
        if (systemSettingActive) {
          backgroundImageLogo = systemSettingActive.systemSettingLogo
        }
        const emailData = {
          user,
          token: user.userToken,
          host_data: hostData,
          backgroundImageLogo,
        }
        const userEmail = env.get('SMTP_USERNAME')
        if (userEmail) {
          await mail.send((message) => {
            message
              .to(request.all().userEmail)
              .from(userEmail, 'SAE')
              .subject('Recover password')
              .htmlView('emails/request_password', emailData)
          })
        }
        response.status(200)
        return {
          type: 'success',
          title: 'Password recovery',
          message: 'A link has been sent to your email successfully',
          data: { user: user },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/auth/request/verify/{token}:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: verify password recovery token
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: token
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async verifyRequestRecovery({ params, response }: HttpContext) {
    try {
      const user = await User.query()
        .where('user_token', params.token)
        .whereNull('user_deleted_at')
        .first()
      if (!user) {
        response.status(404)
        return {
          type: 'warning',
          title: 'Token verification',
          message: 'Invalid token',
          data: {},
        }
      }
      response.status(200)
      return {
        type: 'success',
        title: 'Token verification',
        message: 'The token is valid',
        data: { user: user },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/auth/password/reset:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: password change
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *                 description: Token
   *                 default: ''
   *               userPassword:
   *                 type: string
   *                 description: User new password
   *                 default: ''
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async passwordReset({ request, response }: HttpContext) {
    try {
      const user = await User.query()
        .where('user_token', request.input('token'))
        .whereNull('user_deleted_at')
        .first()

      if (!user) {
        response.status(404)
        return {
          type: 'warning',
          title: 'Password change with token',
          message: 'Invalid token',
          data: {},
        }
      }
      let userPassword = request.input('userPassword')
      const passwordArray = Array.isArray(userPassword)
      userPassword = passwordArray
        ? userPassword.map((item: string) => item).join(',')
        : userPassword
      user.userPassword = userPassword
      user.userToken = ''
      user.save()
      response.status(200)
      return {
        type: 'success',
        title: 'Password change with token',
        message: 'The password has been changed successfully',
        data: { user: user },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/users:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: get all
   *     parameters:
   *       - name: search
   *         in: query
   *         required: false
   *         description: Search
   *         schema:
   *           type: string
   *       - name: roleId
   *         in: query
   *         required: false
   *         description: Role id
   *         schema:
   *           type: integer
   *       - name: page
   *         in: query
   *         required: true
   *         description: The page number for pagination
   *         default: 1
   *         schema:
   *           type: integer
   *       - name: limit
   *         in: query
   *         required: true
   *         description: The number of records per page
   *         default: 100
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: Object processed
   *       '404':
   *         description: The resource could not be found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async index({ request, response }: HttpContext) {
    try {
      const search = request.input('search')
      const roleId = request.input('roleId')
      const page = request.input('page', 1)
      const limit = request.input('limit', 100)
      const filters = {
        search: search,
        roleId: roleId,
        page: page,
        limit: limit,
      } as UserFilterSearchInterface
      const userService = new UserService()
      const users = await userService.index(filters)
      response.status(200)
      return {
        type: 'success',
        title: 'Users',
        message: 'The users were found successfully',
        data: {
          users,
        },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server Error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: create new user
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userEmail:
   *                 type: string
   *                 description: User email
   *                 required: true
   *                 default: ''
   *               userPassword:
   *                 type: string
   *                 description: User password
   *                 required: true
   *                 default: ''
   *               userActive:
   *                 type: boolean
   *                 description: User status
   *                 required: true
   *                 default: true
   *               roleId:
   *                 type: number
   *                 description: Role id
   *                 required: true
   *                 default: ''
   *               personId:
   *                 type: number
   *                 description: Person id
   *                 required: true
   *                 default: ''
   *     responses:
   *       '201':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async store({ auth, request, response }: HttpContext) {
    try {
      const userEmail = request.input('userEmail')
      let userPassword = request.input('userPassword')
      const passwordArray = Array.isArray(userPassword)
      userPassword = passwordArray
        ? userPassword.map((item: string) => item).join(',')
        : userPassword
      const userActive = request.input('userActive')
      const roleId = request.input('roleId')
      const personId = request.input('personId')
      const user = {
        userEmail: userEmail,
        userPassword: userPassword,
        userActive: userActive,
        roleId: roleId,
        personId: personId,
      } as User
      const userService = new UserService()
      const data = await request.validateUsing(createUserValidator)
      const exist = await userService.verifyInfoExist(user)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const newUser = await userService.create(user)
      if (newUser) {
        const rawHeaders = request.request.rawHeaders
        const userId = auth.user?.userId
        if (userId) {
          const logUser = await userService.createActionLog(rawHeaders, 'store')
          logUser.user_id = userId
          logUser.record_current = JSON.parse(JSON.stringify(newUser))
          await userService.saveActionOnLog(logUser)
        }
        response.status(201)
        return {
          type: 'success',
          title: 'Users',
          message: 'The user was created successfully',
          data: { user: newUser },
        }
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }

  /**
   * @swagger
   * /api/users/{userId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: update user
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: number
   *         description: User id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userEmail:
   *                 type: string
   *                 description: User email
   *                 required: true
   *                 default: ''
   *               userPassword:
   *                 type: string
   *                 description: User password
   *                 required: false
   *                 default: ''
   *               userActive:
   *                 type: boolean
   *                 description: User status
   *                 required: true
   *                 default: true
   *               roleId:
   *                 type: number
   *                 description: Role id
   *                 required: true
   *                 default: ''
   *               personId:
   *                 type: number
   *                 description: Person id
   *                 required: true
   *                 default: ''
   *     responses:
   *       '201':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async update({ auth, request, response }: HttpContext) {
    try {
      const input = request.all()
      const userId = request.param('userId')
      const userEmail = request.input('userEmail')
      let userPassword = request.input('userPassword')
      const passwordArray = Array.isArray(userPassword)
      userPassword = passwordArray
        ? userPassword.map((item: string) => item).join(',')
        : userPassword
      input.userPassword = userPassword
      request.updateBody(input)
      const userActive = request.input('userActive')
      const roleId = request.input('roleId')
      const personId = request.input('personId')
      const user = {
        userId: userId,
        userEmail: userEmail,
        userPassword: userPassword,
        userActive: userActive,
        roleId: roleId,
        personId: personId,
      } as User
      if (!userId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The user Id was not found',
          message: 'Missing data to process',
          data: { ...user },
        }
      }
      const currentUser = await User.query()
        .whereNull('user_deleted_at')
        .where('user_id', userId)
        .first()
      if (!currentUser) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The user was not found',
          message: 'The user was not found with the entered ID',
          data: { ...user },
        }
      }
      const previousUser = JSON.parse(JSON.stringify(currentUser))
      const userService = new UserService()
      const data = await request.validateUsing(updateUserValidator)
      const verifyInfo = await userService.verifyInfo(user)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const updateUser = await userService.update(currentUser, user)
      if (updateUser) {
        const rawHeaders = request.request.rawHeaders
        const tokenUserId = auth.user?.userId
        if (tokenUserId) {
          const logUser = await userService.createActionLog(rawHeaders, 'update')
          logUser.user_id = tokenUserId
          logUser.record_current = JSON.parse(JSON.stringify(updateUser))
          logUser.record_previous = previousUser
          await userService.saveActionOnLog(logUser)
        }
        response.status(201)
        return {
          type: 'success',
          title: 'Users',
          message: 'The user was updated successfully',
          data: { user: updateUser },
        }
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }

  /**
   * @swagger
   * /api/users/{userId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: delete user
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: number
   *         description: User id
   *         required: true
   *     responses:
   *       '201':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async delete({ auth, request, response }: HttpContext) {
    try {
      const userId = request.param('userId')
      if (!userId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The user Id was not found',
          message: 'Missing data to process',
          data: { userId },
        }
      }
      const currentUser = await User.query()
        .whereNull('user_deleted_at')
        .where('user_id', userId)
        .first()
      if (!currentUser) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The user was not found',
          message: 'The user was not found with the entered ID',
          data: { userId },
        }
      }
      const userService = new UserService()
      const deleteUser = await userService.delete(currentUser)
      if (deleteUser) {
        const rawHeaders = request.request.rawHeaders
        const tokenUserId = auth.user?.userId
        if (tokenUserId) {
          const logUser = await userService.createActionLog(rawHeaders, 'delete')
          logUser.user_id = tokenUserId
          logUser.record_current = JSON.parse(JSON.stringify(deleteUser))
          await userService.saveActionOnLog(logUser)
        }
        response.status(201)
        return {
          type: 'success',
          title: 'User',
          message: 'The user was deleted successfully',
          data: { user: deleteUser },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/users/{userId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     summary: get user by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: number
   *         description: User id
   *         required: true
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async show({ request, response }: HttpContext) {
    try {
      const userId = request.param('userId')
      if (!userId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The user Id was not found',
          message: 'Missing data to process',
          data: { userId },
        }
      }
      const userService = new UserService()
      const showUser = await userService.show(userId)
      if (!showUser) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The user was not found',
          message: 'The user was not found with the entered ID',
          data: { userId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Users',
          message: 'The user was found successfully',
          data: { user: showUser },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
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
