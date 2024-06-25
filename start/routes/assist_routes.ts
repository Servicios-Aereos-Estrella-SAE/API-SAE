/* eslint-disable prettier/prettier */
import router from '@adonisjs/core/services/router'
// import { middleware } from '../kernel.js'

router
  .group(() => {
    router.get('/', '#controllers/assists_controller.index')//.use(middleware.auth({ guards: ['api'] }))
    router.post('/synchronize', '#controllers/assists_controller.synchronize')
  })
  .prefix('/api/v1/assists')
