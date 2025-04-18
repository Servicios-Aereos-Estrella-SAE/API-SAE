import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post('/', '#controllers/address_controller.store')
    router.put('/:addressId', '#controllers/address_controller.update')
  })
  .prefix('/api/address')
  .use(middleware.auth())
router
  .group(() => {
    router.get('/', '#controllers/address_controller.getPlaces')
  })
  .prefix('/api/address-get-places')
  .use(middleware.auth())
