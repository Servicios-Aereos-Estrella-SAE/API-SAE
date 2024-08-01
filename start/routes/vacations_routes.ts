import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/vacation_settings_controller.index')
    router.post('/', '#controllers/vacation_settings_controller.store')
    router.put('/:id', '#controllers/vacation_settings_controller.update')
    router.delete('/:id', '#controllers/vacation_settings_controller.destroy')
    router.get('/:id', '#controllers/vacation_settings_controller.show')
  })
  .prefix('/api/vacations')
