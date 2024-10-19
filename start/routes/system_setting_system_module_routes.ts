import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', '#controllers/system_setting_system_module_controller.store')
    router.put(
      '/:systemSettingSystemModuleId',
      '#controllers/system_setting_system_module_controller.update'
    )
    router.delete(
      '/:systemSettingSystemModuleId',
      '#controllers/system_setting_system_module_controller.delete'
    )
    router.delete(
      '/:systemSettingId/:systemModuleId',
      '#controllers/system_setting_system_module_controller.deleteRelation'
    )
    router.get(
      '/:systemSettingSystemModuleId',
      '#controllers/system_setting_system_module_controller.show'
    )
  })
  .prefix('/api/system-settings-system-modules')
