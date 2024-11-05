import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post('/shift-for-employees', '#controllers/shift_for_employees_controller.index')
  })
  .prefix('/api')
  .use(middleware.auth())
