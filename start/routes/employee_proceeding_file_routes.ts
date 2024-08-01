import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/employee_proceeding_file_controller.index')
    router.post('/', '#controllers/employee_proceeding_file_controller.store')
    router.put(
      '/:employeeProceedingFileId',
      '#controllers/employee_proceeding_file_controller.update'
    )
    router.delete(
      '/:employeeProceedingFileId',
      '#controllers/employee_proceeding_file_controller.delete'
    )
    router.get(
      '/:employeeProceedingFileId',
      '#controllers/employee_proceeding_file_controller.show'
    )
  })
  .prefix('/api/employees-proceeding-files')
