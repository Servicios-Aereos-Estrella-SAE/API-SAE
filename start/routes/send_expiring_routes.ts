import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/proceeding_files_controller.sendExpiringAndExpiredFilesReport')
  })
  .prefix('/api/send-expiring')
