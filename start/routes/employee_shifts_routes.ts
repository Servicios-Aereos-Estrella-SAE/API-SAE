import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/employee_shifts', '#controllers/employee_shifts_controller.store')
    router.get('/employee_shifts', '#controllers/employee_shifts_controller.index')
    router.get('/employee_shifts/:id', '#controllers/employee_shifts_controller.show')
    router.put('/employee_shifts/:id', '#controllers/employee_shifts_controller.update')
    router.delete('/employee_shifts/:id', '#controllers/employee_shifts_controller.destroy')
  })
  .prefix('/api')
