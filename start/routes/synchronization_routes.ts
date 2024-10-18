import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post('/departments', '#controllers/department_controller.synchronization')
    router.post('/positions', '#controllers/position_controller.synchronization')
    router.post('/employees', '#controllers/employee_controller.synchronization')
    router.post('/shift', '#controllers/shifts_controller.synchronization')
  })
  .prefix('/api/synchronization')
  .use(middleware.auth())
