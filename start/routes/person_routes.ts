import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/person_controller.index')
    router.post('/', '#controllers/person_controller.store')
    router.put('/:personId', '#controllers/person_controller.update')
    router.delete('/:personId', '#controllers/person_controller.delete')
    router.get('/:personId', '#controllers/person_controller.show')
  })
  .prefix('/api/persons')
