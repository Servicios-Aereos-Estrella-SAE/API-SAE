import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/employee_controller.getAll')
  })
  .prefix('/api/employees')
