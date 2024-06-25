import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', '#controllers/person_controller.store')
    router.put('/:personId', '#controllers/person_controller.update')
    router.delete('/:personId', '#controllers/person_controller.delete')
  })
  .prefix('/api/persons')