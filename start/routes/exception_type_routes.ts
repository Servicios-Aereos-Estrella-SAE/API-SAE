import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/exception_type_controller.index')
  })
  .prefix('/api/exception-types')
