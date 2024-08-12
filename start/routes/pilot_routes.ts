import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/pilot_controller.index')
    router.post('/', '#controllers/pilot_controller.store')
    router.put('/:pilotId', '#controllers/pilot_controller.update')
    router.delete('/:pilotId', '#controllers/pilot_controller.delete')
    router.get('/:pilotId', '#controllers/pilot_controller.show')
  })
  .prefix('/api/pilots')
