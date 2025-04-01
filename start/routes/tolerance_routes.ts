import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/:systemSettingId', '#controllers/tolerances_controller.index')
    router.get(
      '/get-tardiness-tolerance',
      '#controllers/tolerances_controller.getTardinessTolerance'
    )
    router.post('/', '#controllers/tolerances_controller.store')
    router.put('/:id', '#controllers/tolerances_controller.update')
    router.delete('/:id', '#controllers/tolerances_controller.destroy')
    router.get('/:id', '#controllers/tolerances_controller.show')
  })
  .prefix('/api/tolerances')
  .use(middleware.auth())
