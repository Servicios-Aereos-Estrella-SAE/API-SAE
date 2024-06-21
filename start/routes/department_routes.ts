import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/sync-positions', '#controllers/department_controller.syncPositions')
    router.get('/:departmentId/positions', '#controllers/department_controller.getPositions')
    router.get('/', '#controllers/department_controller.getAll')
  })
  .prefix('/api/departments')
