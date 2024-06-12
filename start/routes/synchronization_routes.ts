import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/departments', '#controllers/department_controller.synchronization')
    router.post('/positions', '#controllers/position_controller.synchronization')
  })
  .prefix('/api/synchronization')
