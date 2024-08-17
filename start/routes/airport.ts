import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/airports_controller.index')
    router.post('/', '#controllers/airports_controller.store')
    router.put('/:id', '#controllers/airports_controller.update')
    router.delete('/:id', '#controllers/airports_controller.destroy')
    router.get('/:id', '#controllers/airports_controller.show')
  })
  .prefix('/api/airports')
