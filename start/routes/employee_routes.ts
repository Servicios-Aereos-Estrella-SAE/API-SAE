import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/employee_controller.getAll')
    router.post('/', '#controllers/employee_controller.store')
    router.put('/:employeeId', '#controllers/employee_controller.update')
    router.delete('/:employeeId', '#controllers/employee_controller.delete')
    router.get('/:employeeId', '#controllers/employee_controller.show')
  })
  .prefix('/api/employees')
