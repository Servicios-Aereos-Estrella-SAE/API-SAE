import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', '#controllers/mongo-db/log_controller.index')
  })
  .prefix('/api/logs')
  .use(middleware.auth())
