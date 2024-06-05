import User from '../models/user.js'
import { HttpContext } from '@adonisjs/core/http'
import ApiToken from '../models/ApiToken.js'
import { uuid } from 'uuidv4'
import mail from '@adonisjs/mail/services/main'
import env from '../../start/env.js'

export default class UserController {
  /**
   * @swagger
   * /api/login:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Usuarios
   *     summary: Iniciar Sesión
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               user_email:
   *                 type: string
   *                 description: Correo electrónico del usuario
   *                 default: ''
   *               user_password:
   *                 type: string
   *                 description: Contraseña del usuario
   *                 default: ''
   *     responses:
   *       '200':
   *         description: Recurso procesado de manera exitosa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Objeto procesado
   *       '404':
   *         description: No se ha encontrado el recurso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       '400':
   *         description: Los parametros ingresados son invalidos o faltan datos necesarios para procesar la solicitud
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       default:
   *         description: Error inesperado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Mensaje de error obtenido
   *                   properties:
   *                     error:
   *                       type: string
   */

  async login({ request, response }: HttpContext) {
    try {
      const userEmail = request.input('user_email')
      const userPassword = request.input('user_password')
      /**
       * Find a user by email. Return error if a user does
       * not exists
       */
      const user = await User.query().where('user_email', userEmail).where('user_active', 1).first()
      if (!user) {
        response.status(404)
        return {
          type: 'warning',
          title: 'Inicio de sesión',
          message: 'Correo o contraseña incorrectos',
          data: { user: {} },
        }
      }
      await ApiToken.query().where('tokenable_id', user.user_id).delete()
      /**
       * Verify the password using the hash service
       */
      const userVerify = await User.verifyCredentials(userEmail, userPassword)
      const token = await User.accessTokens.create(user)
      /**
       * Now login the user or create a token for them
       */
      if (userVerify && token) {
        response.status(200)
        return {
          type: 'success',
          title: 'Inicio de sesión',
          message: 'Has iniciado sesión correctamente',
          data: {
            user: user,
            token: token.value!.release(),
          },
        }
      } else {
        response.status(404)
        return {
          type: 'warning',
          title: 'Inicio de sesión',
          message: 'Correo o contraseña incorrectos',
          data: { user: {} },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Error de servidor',
        message: 'Se ha presentado un error inesperado en el servidor',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/login/logout:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Usuarios
   *     summary: Cerrar Sesión
   *     produces:
   *       - application/json
   *     responses:
   *       '200':
   *         description: Recurso procesado de manera exitosa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Objeto procesado
   *       '404':
   *         description: No se ha encontrado el recurso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       '400':
   *         description: Los parametros ingresados son invalidos o faltan datos necesarios para procesar la solicitud
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       default:
   *         description: Error inesperado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Mensaje de error obtenido
   *                   properties:
   *                     error:
   *                       type: string
   */

  async logout({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticateUsing(['api'])
      await auth.use('api').authenticate()
      await ApiToken.query().where('tokenable_id', auth.user!.user_id).delete()
      response.status(200)
      return {
        type: 'success',
        title: 'Cierre de sesión',
        message: 'Has cerrado sesión correctamente',
        data: { user: user },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Error de servidor',
        message: 'Se ha presentado un error inesperado en el servidor',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/login/recovery:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Usuarios
   *     summary: Recuperación de contraseña
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               user_email:
   *                 type: string
   *                 description: Correo electrónico del usuario
   *                 default: ''
   *     responses:
   *       '200':
   *         description: Recurso procesado de manera exitosa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Objeto procesado
   *       '404':
   *         description: No se ha encontrado el recurso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       '400':
   *         description: Los parametros ingresados son invalidos o faltan datos necesarios para procesar la solicitud
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       default:
   *         description: Error inesperado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Mensaje de error obtenido
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
          .where('user_email', request.all().user_email)
          .whereNull('user_deleted_at')
          .preload('person')
          .first()
        const encrypted = uuid()
        if (!user) {
          response.status(404)
          return {
            type: 'warning',
            title: 'Recuperación de contraseña',
            message: 'Correo no encontrado',
            data: {},
          }
        }
        user.user_token = encrypted
        user.save()
        const emailData = {
          user,
          token: user.user_token,
          host_data: hostData,
        }
        const userEmail = env.get('SMTP_USERNAME')
        if (userEmail) {
          await mail.send((message) => {
            message
              .to(request.all().user_email)
              .from(userEmail, 'SAE')
              .subject('Recuperar Contraseña')
              .htmlView('emails/request_password', emailData)
          })
        }
        response.status(200)
        return {
          type: 'success',
          title: 'Recuperación de contraseña',
          message: 'Se te ha enviado una liga al correo correctamente',
          data: { user: user },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Error de servidor',
        message: 'Se ha presentado un error inesperado en el servidor',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/login/request/verify/{token}:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Usuarios
   *     summary: Verificar token de recuperación de contraseña
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
   *         description: Recurso procesado de manera exitosa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Objeto procesado
   *       '404':
   *         description: No se ha encontrado el recurso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       '400':
   *         description: Los parametros ingresados son invalidos o faltan datos necesarios para procesar la solicitud
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       default:
   *         description: Error inesperado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Mensaje de error obtenido
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
          title: 'Verificación de token',
          message: 'Token no valido',
          data: {},
        }
      }
      response.status(200)
      return {
        type: 'success',
        title: 'Verificación de token',
        message: 'El token es valido',
        data: { user: user },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Error de servidor',
        message: 'Se ha presentado un error inesperado en el servidor',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/login/password/reset:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Usuarios
   *     summary: Cambio de contraseña
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
   *               user_password:
   *                 type: string
   *                 description: Nueva contraseña del usuario
   *                 default: ''
   *     responses:
   *       '200':
   *         description: Recurso procesado de manera exitosa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Objeto procesado
   *       '404':
   *         description: No se ha encontrado el recurso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       '400':
   *         description: Los parametros ingresados son invalidos o faltan datos necesarios para procesar la solicitud
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Lista de parametros establecidos por el cliente
   *       default:
   *         description: Error inesperado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta generada
   *                 title:
   *                   type: string
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   description: Mensaje de la respuesta
   *                 data:
   *                   type: object
   *                   description: Mensaje de error obtenido
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
          title: 'Cambio de contraseña con token',
          message: 'Token no valido',
          data: {},
        }
      }
      user.user_password = request.input('user_password')
      user.user_token = ''
      user.save()
      response.status(200)
      return {
        type: 'success',
        title: 'Cambio de contraseña con token',
        message: 'La contraseña se ha cambiado correctamente',
        data: { user: user },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Error de servidor',
        message: 'Se ha presentado un error inesperado en el servidor',
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
