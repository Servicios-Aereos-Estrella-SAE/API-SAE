import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/customer_proceeding_file_controller.index')
    router.post('/', '#controllers/customer_proceeding_file_controller.store')
    router.put(
      '/:customerProceedingFileId',
      '#controllers/customer_proceeding_file_controller.update'
    )
    router.delete(
      '/:customerProceedingFileId',
      '#controllers/customer_proceeding_file_controller.delete'
    )
    router.get(
      '/:customerProceedingFileId',
      '#controllers/customer_proceeding_file_controller.show'
    )
  })
  .prefix('/api/customers-proceeding-files')
