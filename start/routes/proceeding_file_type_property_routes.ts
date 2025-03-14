import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/proceeding_file_type_property_controller.index')
    router.get(
      '/get-categories-by-employee',
      '#controllers/proceeding_file_type_property_controller.getCategories'
    )
  })
  .prefix('/api/proceeding-file-type-properties')
  .use(middleware.auth())
