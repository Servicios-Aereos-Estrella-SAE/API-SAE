import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', '#controllers/position_controller.store')
    router.put('/:positionId', '#controllers/position_controller.update')
    router.delete('/:positionId', '#controllers/position_controller.delete')
    router.get('/:positionId', '#controllers/position_controller.show')
    router.post('-assign-shift/:positionId', '#controllers/position_controller.assignShift')
  })
  .prefix('/api/positions')
