import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', '#controllers/department_position_controller.store')
    router.put('/:departmentPositionId', '#controllers/department_position_controller.update')
    router.delete('/:departmentPositionId', '#controllers/department_position_controller.delete')
    router.get('/:departmentPositionId', '#controllers/department_position_controller.show')
  })
  .prefix('/api/departments-positions')
