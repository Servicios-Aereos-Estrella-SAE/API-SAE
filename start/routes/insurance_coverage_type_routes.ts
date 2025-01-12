import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/insurance_coverage_type_controller.index')
  })
  .prefix('/api/insurance-coverage-types')
  .use(middleware.auth())
