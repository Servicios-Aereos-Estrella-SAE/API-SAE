import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/assign/:roleId', '#controllers/role_controller.assign')
    router.get(
      '/has-access/:roleId/:systemModuleSlug/:systemPermissionSlug',
      '#controllers/role_controller.hasAccess'
    )
    router.get('/get-access/:roleId', '#controllers/role_controller.getAccess')
    router.get(
      '/get-access-by-module/:roleId/:systemModuleSlug',
      '#controllers/role_controller.getAccessByModule'
    )
    router.get('/', '#controllers/role_controller.index')
    router.get('/:roleId', '#controllers/role_controller.show')
  })
  .prefix('/api/roles')
