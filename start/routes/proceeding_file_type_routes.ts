import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/proceeding_file_type_controller.index')
  })
  .prefix('/api/proceeding-file-types')
