import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/role_controller.index')
  })
  .prefix('/api/roles')
