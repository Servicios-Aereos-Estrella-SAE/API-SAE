// import type { HttpContext } from '@adonisjs/core/http'

import hash from '@adonisjs/core/services/hash'
import User from '../models/User.js'
import { HttpContext } from '@adonisjs/core/http'

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
      // console.log(userEmail)
      // console.log(userPassword)
      /**
       * Find a user by email. Return error if a user does
       * not exists
       */
      const user = await User.findBy('user_email', userEmail)
      if (!user) {
        console.error('usuario no encontrado')
        response.status(404)
        return {
          type: 'warning',
          title: 'Inicio de sesión',
          message: 'Correo o contraseña incorrectos',
          data: { user: {} },
        }
      }

      /**
       * Verify the password using the hash service
       */
      const logged = await hash.verify(user.user_password, userPassword)
      // console.log(logged)
      // const userVerify = await User.verifyCredentials(userEmail, userPassword)
      // console.log(userVerify)
      // const authUser = await auth.use('web').login(user)
      // console.log(authUser)
      // const token = await User.accessTokens.create(user)
      // console.log(token)
      /**
       * Now login the user or create a token for them
       */
      if (logged) {
        // console.log('ok')
        response.status(200)
        return {
          type: 'success',
          title: 'Inicio de sesión',
          message: 'Has iniciado sesión correctamente',
          data: { user: user },
        }
      } else {
        // console.log('credenciales no validas')
        response.status(404)
        return {
          type: 'warning',
          title: 'Inicio de sesión',
          message: 'Correo o contraseña incorrectos',
          data: { user: {} },
        }
      }
    } catch (error) {
      // console.log(error)
      response.status(500)
      return {
        type: 'error',
        title: 'Error de servidor',
        message: 'Se ha presentado un error inesperado en el servidor',
        error: error.message,
      }
    }
  }
}
