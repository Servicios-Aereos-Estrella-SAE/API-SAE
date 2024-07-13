import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/without-user', '#controllers/employee_controller.indexWithOutUser')
    router.get('/', '#controllers/employee_controller.index')
    router.post('/', '#controllers/employee_controller.store')
    router.put('/:employeeId', '#controllers/employee_controller.update')
    router.delete('/:employeeId', '#controllers/employee_controller.delete')
    router.get('/:employeeId', '#controllers/employee_controller.show')
    router.put('/:employeeId/photo', '#controllers/employee_controller.uploadPhoto')
  })
  .prefix('/api/employees')
