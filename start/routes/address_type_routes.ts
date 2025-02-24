import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/address_type_controller.index')
  })
  .prefix('/api/address-types')
  .use(middleware.auth())
