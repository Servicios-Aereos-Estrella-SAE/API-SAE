import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/user_controller.index')
    router.post('/', '#controllers/user_controller.store')
    router.put('/:userId', '#controllers/user_controller.update')
    router.delete('/:userId', '#controllers/user_controller.delete')
    router.get('/:userId', '#controllers/user_controller.show')
  })
  .prefix('/api/users')
