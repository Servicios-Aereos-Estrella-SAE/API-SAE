import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/sync-positions', '#controllers/department_controller.syncPositions')
    router.get('/:departmentId/positions', '#controllers/department_controller.getPositions')
    router.get(
      '/search/:departmentId/positions',
      '#controllers/department_controller.getSearchPositions'
    )
    router.get('/', '#controllers/department_controller.getAll')
    router.get('/search', '#controllers/department_controller.getSearch')
    router.post('/', '#controllers/department_controller.store')
    router.put('/:departmentId', '#controllers/department_controller.update')
    router.delete('/:departmentId', '#controllers/department_controller.delete')
    router.delete('/:departmentId/force-delete', '#controllers/department_controller.forceDelete')
    router.get('/:departmentId', '#controllers/department_controller.show')
  })
  .prefix('/api/departments')
router
  .group(() => {
    router.post('/assign-shift/:departmentId', '#controllers/department_controller.assignShift')
  })
  .prefix('/api/department')
