import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/exception_type_controller.index')
  })
  .prefix('/api/exception-types')
  .use(middleware.auth())
