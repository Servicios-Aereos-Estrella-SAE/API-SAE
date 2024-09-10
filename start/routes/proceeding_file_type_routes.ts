import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/by-area/:areaToUse', '#controllers/proceeding_file_type_controller.indexByArea')
    router.get('/', '#controllers/proceeding_file_type_controller.index')
  })
  .prefix('/api/proceeding-file-types')
