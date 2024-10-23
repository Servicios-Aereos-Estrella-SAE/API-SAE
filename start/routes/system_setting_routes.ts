import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post(
      '/assign-system-modules/:systemSettingId',
      '#controllers/system_setting_controller.assignSystemModules'
    )
    router.get('/get-active', '#controllers/system_setting_controller.getActive')
    router.get('/', '#controllers/system_setting_controller.index')
    router.post('/', '#controllers/system_setting_controller.store')
    router.put('/:systemSettingId', '#controllers/system_setting_controller.update')
    router.delete('/:systemSettingId', '#controllers/system_setting_controller.delete')
    router.get('/:systemSettingId', '#controllers/system_setting_controller.show')
  })
  .prefix('/api/system-settings')
  .use(middleware.auth())
