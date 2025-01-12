import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/work_disability_controller.index')
    router.post('/', '#controllers/work_disability_controller.store')
    router.delete('/:workDisabilityId', '#controllers/work_disability_controller.delete')
    router.get('/:workDisabilityId', '#controllers/work_disability_controller.show')
  })
  .prefix('/api/work-disabilities')
  .use(middleware.auth())
