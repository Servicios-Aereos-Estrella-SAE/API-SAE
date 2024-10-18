import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/proceeding_files_controller.sendExpiringAndExpiredFilesReport')
  })
  .prefix('/api/send-expiring')
  .use(middleware.auth())
