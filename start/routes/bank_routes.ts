import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/bank_controller.index')
  })
  .prefix('/api/banks')
  .use(middleware.auth())
