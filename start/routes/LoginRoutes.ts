import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', '#controllers/usercontroller.login')
    // router.post('/logout', 'UserController.logout')
    // router.post('/recovery', 'UserController.recoveryPassword')
    // router.post('/request/verify/:token', 'UserController.verifyRequestRecovery')
    // router.post('/password/request', 'UserController.requestRecovery')
    // router.post('/password/reset', 'UserController.passwordReset')
    // router.post('/user-auth', 'UserController.userAuth')
  })
  .prefix('/api/login')
