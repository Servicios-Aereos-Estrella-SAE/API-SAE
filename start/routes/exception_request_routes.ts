import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/exception_requests_controller.index')
    router.post('/', '#controllers/exception_requests_controller.store')
    router.put('/:id', '#controllers/exception_requests_controller.update')
    router.delete('/:id', '#controllers/exception_requests_controller.destroy')
    router.get('/:id', '#controllers/exception_requests_controller.show')
  })
  .prefix('/api/exception-requests')
