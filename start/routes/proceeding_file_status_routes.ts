import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/proceeding_file_status_controller.index')
  })
  .prefix('/api/proceeding-file-status')
  .use(middleware.auth())
