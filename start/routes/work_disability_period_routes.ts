import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post('/', '#controllers/work_disability_period_controller.store')
    router.get('/:workDisabilityPeriodId', '#controllers/work_disability_period_controller.show')
  })
  .prefix('/api/work-disability-periods')
  .use(middleware.auth())
