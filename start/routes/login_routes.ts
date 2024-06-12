import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router
  .group(() => {
    router.post('/', '#controllers/user_controller.login')
    router.post('/logout', '#controllers/user_controller.logout').use(
      middleware.auth({
        guards: ['api'],
      })
    )
    router.post('/recovery', '#controllers/user_controller.recoveryPassword')
    router.post('/request/verify/:token', '#controllers/user_controller.verifyRequestRecovery')
    // router.post('/password/request', 'user_controller.requestRecovery')
    router.post('/password/reset', '#controllers/user_controller.passwordReset')
    // router.post('/user-auth', 'user_controller.userAuth')
  })
  .prefix('/api/login')
