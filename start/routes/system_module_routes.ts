import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/system_module_controller.index')
  })
  .prefix('/api/system-modules')
