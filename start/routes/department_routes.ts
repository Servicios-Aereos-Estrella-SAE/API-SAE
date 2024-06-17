import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/sync-positions', '#controllers/department_controller.syncPositions')
    router.get('/:departmentId/get-positions', '#controllers/department_controller.getPositions')
  })
  .prefix('/api/departments')
