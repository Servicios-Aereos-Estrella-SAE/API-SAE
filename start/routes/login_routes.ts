import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router
  .group(() => {
    router.post('/', '#controllers/usercontroller.login')
    router.post('/logout', '#controllers/usercontroller.logout').use(
      middleware.auth({
        guards: ['api'],
      })
    )
    router.post('/recovery', '#controllers/usercontroller.recoveryPassword')
    router.post('/request/verify/:token', '#controllers/usercontroller.verifyRequestRecovery')
    // router.post('/password/request', 'UserController.requestRecovery')
    router.post('/password/reset', '#controllers/usercontroller.passwordReset')
    // router.post('/user-auth', 'UserController.userAuth')
  })
  .prefix('/api/login')
