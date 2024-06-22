import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/employee_controller.getAll')
    router.post('/', '#controllers/employee_controller.create')
  })
  .prefix('/api/employees')
