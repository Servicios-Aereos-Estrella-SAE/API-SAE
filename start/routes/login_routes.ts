/* eslint-disable prettier/prettier */

import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router.group(() => {
  router.post('/login', '#controllers/user_controller.login')
  router.post('/logout', '#controllers/user_controller.logout').use(middleware.auth({ guards: ['api'] }))
  router.post('/recovery', '#controllers/user_controller.recoveryPassword')
  router.post('/request/verify/:token', '#controllers/user_controller.verifyRequestRecovery')
  router.post('/password/reset', '#controllers/user_controller.passwordReset')
  router.get('/session', '#controllers/user_controller.authUser')
}).prefix('/api/auth')
