import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/work_disability_type_controller.index')
  })
  .prefix('/api/work-disability-types')
  .use(middleware.auth())
