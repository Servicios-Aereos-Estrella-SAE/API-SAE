import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/:positionId', '#controllers/position_controller.show')
  })
  .prefix('/api/positions')
