import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/vacation_settings_controller.index')
    router.post('/', '#controllers/vacation_settings_controller.store')
    router.put('/:vacationSettingId', '#controllers/vacation_settings_controller.update')
    router.delete('/:vacationSettingId', '#controllers/vacation_settings_controller.destroy')
    router.get('/:vacationSettingId', '#controllers/vacation_settings_controller.show')
  })
  .prefix('/api/vacations')
  .use(middleware.auth())
