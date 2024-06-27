import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/shift_exception', '#controllers/shift_exceptions_controller.store')
    router.get('/shift_exception', '#controllers/shift_exceptions_controller.index')
    router.get('/shift_exception/:id', '#controllers/shift_exceptions_controller.show')
    router.put('/shift_exception/:id', '#controllers/shift_exceptions_controller.update')
    router.delete('/shift_exception/:id', '#controllers/shift_exceptions_controller.destroy')
  })
  .prefix('/api')
