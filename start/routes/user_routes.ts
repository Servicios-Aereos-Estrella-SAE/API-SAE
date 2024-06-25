import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', '#controllers/user_controller.store')
    router.put('/:userId', '#controllers/user_controller.update')
    router.delete('/:userId', '#controllers/user_controller.delete')
  })
  .prefix('/api/users')
