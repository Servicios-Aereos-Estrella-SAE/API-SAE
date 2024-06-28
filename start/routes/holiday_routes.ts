import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/holidays', '#controllers/holidays_controller.store')
    router.get('/holidays', '#controllers/holidays_controller.index')
    router.get('/holidays/:id', '#controllers/holidays_controller.show')
    router.put('/holidays/:id', '#controllers/holidays_controller.update')
    router.delete('/holidays/:id', '#controllers/holidays_controller.destroy')
  })
  .prefix('/api')