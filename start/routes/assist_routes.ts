/* eslint-disable prettier/prettier */
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// import { middleware } from '../kernel.js'

router
  .group(() => {
    router.get('/', '#controllers/assists_controller.index')//.use(middleware.auth({ guards: ['api'] }))
    router.get('/status', '#controllers/assists_controller.getStatusSync')
    router.post('/synchronize', '#controllers/assists_controller.synchronize')
  }).use(middleware.auth())
  .prefix('/api/v1/assists')
