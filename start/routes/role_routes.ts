import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/assign/:roleId', '#controllers/role_controller.assign')
    router.get('/', '#controllers/role_controller.index')
  })
  .prefix('/api/roles')
