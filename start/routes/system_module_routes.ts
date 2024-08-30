import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/system_module_controller.index')
    router.get('/:systemModuleSlug', '#controllers/system_module_controller.show')
  })
  .prefix('/api/system-modules')
