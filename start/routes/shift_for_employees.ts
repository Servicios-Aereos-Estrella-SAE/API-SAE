import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/shift-for-employees', '#controllers/shift_for_employees_controller.index')
  })
  .prefix('/api')
