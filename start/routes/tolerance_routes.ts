import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/tolerances_controller.index')
    router.post('/', '#controllers/tolerances_controller.store')
    router.put('/:id', '#controllers/tolerances_controller.update')
    router.delete('/:id', '#controllers/tolerances_controller.destroy')
    router.get('/:id', '#controllers/tolerances_controller.show')
  })
  .prefix('/api/tolerances')
