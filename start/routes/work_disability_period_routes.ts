import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post('/', '#controllers/work_disability_period_controller.store')
  })
  .prefix('/api/work-disability-periods')
  .use(middleware.auth())
